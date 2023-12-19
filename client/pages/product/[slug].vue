<template>
    <MainLayout>
        <UContainer>
            <div class="flex justify-between" v-if="product.name">
                <!-- images -->
                <div v-if="imagesQueue.length" class="flex-1 w-1/2 flex gap-x-10">
                    <div class="flex flex-col gap-y-2">
                    <div
                        v-for="(imageQueue, index) in imagesQueue"
                        :key="index"
                        @click="handleActiveImageView(index)"
                    >
                        <img
                        :src="imageQueue.src"
                        alt=""
                        :class="
                            activeImage === index
                            ? ' border-red-500 border-2'
                            : ' border-red-200 border'
                        "
                        class="w-28 h-24 object-cover cursor-pointer p-1"
                        />
                    </div>
                    </div>
                    <div>
                    <div>
                        <img
                        :src="imagesQueue[activeImage].src"
                        alt=""
                        class="w-[400px] h-[400px] object-cover cursor-pointer"
                        />
                    </div>
                    </div>
                </div>
                <!-- end images -->
                <!-- detail -->
                <div class="flex-1" v-if="product">
                    <div>
                        <h2>{{ product.name }}</h2>
                        <span>{{ Number(product.price).toLocaleString() }} đ</span>
                    </div>
                    <div>
                        <h3>SKU: <span class="font-semibold">{{sku ? sku : product.sku}}</span></h3>
                    </div>
                    <div v-if="totalQuantity > 0">
                        <div v-if="colors.length" class="my-3">
                            <h3>Chọn màu sắc:</h3>
                            <label
                                v-for="(item, index) in colors"
                                :key="index"
                                :class="item.label === selectedColor ? 'border-primary' : ''"
                                class="color-option p-1 mr-5 btn inline-block border cursor-pointer hover:border-primary"
                                :for="item.label"
                                @change="handleChooseColor"
                            >
                                <input
                                type="radio"
                                :id="item.label"
                                v-model="selectedColor"
                                name="color"
                                :value="item.label"
                                class="hidden"
                                />
                                {{ item.label }}
                            </label>
                        </div>
                        <div v-if="sizes.length" class="my-3">
                            <h3>Chọn kích cỡ:</h3>
                            <label
                                v-for="(item, index) in sizes"
                                :key="index"
                                v-bind:class="item.label === selectedSize ? 'border-primary' : ''"
                                class="color-option mr-5 btn inline-block border p-1 "
                                :class="
                                !enableSizes.includes(item.label) || !selectedColor //css
                                ? 'opacity-50 cursor-not-allowed  border hover:border-gray-200'
                                    : 'hover:border-primary cursor-pointer'
                                "
                                :for="item.label"
                            >
                                <input
                                type="radio"
                                :id="item.label"
                                v-model="selectedSize"
                                name="size"
                                :value="item.label"
                                class="hidden"
                                @change="handleChooseSize"
                                :disabled="!enableSizes.includes(item.label) || !selectedColor"
                                />
                                {{ item.label }}
                            </label>
                        </div>
                        <div class="flex my-3">
                            <UButton
                                icon="i-heroicons-minus"
                                size="xs"
                                color="primary"
                                square
                                variant="outline"
                                @click="handleChangeSelectedQuantity('minus')"
                            />
                            <UInput class="w-[100px] text-center mx-2" @change="handleValidateQuantity" size="sm" v-model="selectedQuantity"/>
                            <UButton
                                icon="i-heroicons-plus"
                                size="xs"
                                color="primary"
                                square
                                variant="outline"
                                @click="handleChangeSelectedQuantity('plus')"
                            />
                        </div>
                        <div>
                            <span>{{ selectedSize ? `Số lượng còn lại: ${quantity}` : totalQuantity===0 ? "het hang":`tong con: ${totalQuantity}` }}</span>
                        </div>
                        <!-- {{ selectedQuantity }} -->
                        <UButton @click="handleAddProductToCart" class="my-2">
                            Thêm vào giỏ hàng
                        </UButton>
                    </div>
                    <div v-else>
                        ops! hết hàng, chọn sản phẩm khác 
                        <UButton to="/collections">
                            Tại đây
                        </UButton>
                    </div>
                    <div>
                        <h3>
                            Chi tiết sản phẩm:
                        </h3>
                        <div v-html="product.description">
                            
                        </div>
                    </div>
                </div>
                <!-- end detail -->
                
            </div>
            <div>
                
            </div>
        </UContainer>
    </MainLayout>
</template>

<script setup>
import MainLayout from '../layouts/MainLayout.vue';
import { cartStore } from '~/stores/cart';
import { authStore } from '~/stores/auth';

import request from '../../utils/request'

const cart = cartStore()
const auth = authStore()

const route = useRoute()
const toast = useToast()
const product = ref({})
const variants = ref([])
const sizes = ref([])
const colors = ref([])
const enableSizes = ref([])
const sku = ref("")
const selectedSize = ref(null)
const selectedColor = ref(null)
const selectedQuantity = ref(1)
const quantity = ref(1)
const totalQuantity = ref(1)
const validate = ref(false)

const {slug} = route.params


const imagesQueue = ref([])
const activeImage = ref(0)
const handleActiveImageView = (i)=>{
  activeImage.value = i;       
}

const handleChooseSize = ()=>{
    console.log(selectedSize);
    console.log(selectedColor);
    const selectedVariant = variants.value.find(
        variant => variant.sizeId.name === selectedSize.value && variant.colorId.name === selectedColor.value
    );

    // Lấy số lượng của biến thể nếu tìm thấy
     quantity.value = selectedVariant ? selectedVariant.quantity : 0;
     sku.value = selectedVariant ? selectedVariant.sku : ''
}

const handleChooseColor = ()=>{

    selectedQuantity.value = 1
    selectedSize.value = null
    sku.value = ''
    const checkedSizes = [];
// Lọc danh sách màu cho kích thước đã chọn
    const sizesForSelectedColor = variants.value
    .filter((variant) => variant.colorId.name === selectedColor.value && variant.quantity >= 1)
    .map((variant) => variant.sizeId.name);
    const filteredSizes = sizesForSelectedColor.filter((size) => {
    if (!checkedSizes.includes(size)) {
        checkedSizes.push(size);
        return true;
    }
    return false;
    });
enableSizes.value =filteredSizes
}

const handleChangeSelectedQuantity = type => {
    const isPlus = type === "plus";
    const isSubtract = type === "minus";
    if(!selectedColor.value || !selectedSize.value){
        toast.add({ title: "Vui lòng chọn phân loại trước", color:"red", timeout: 2000 })
        return
    }
    if (isPlus && selectedQuantity.value < quantity.value) {
        selectedQuantity.value += 1;
    }else if(isPlus && selectedQuantity.value >= quantity.value){
        toast.add({ title: "Đã đạt giới hạn số lượng trong kho", color:"red", timeout: 2000 })
    }
     else if (isSubtract && selectedQuantity.value > 1) {
        selectedQuantity.value -= 1;
    }else{
        toast.add({ title: "Tối thiểu là 1 sản phẩm", color:"red", timeout: 2000 })
    }
}
const handleValidateQuantity = () => {
  const regex = /^[0-9]+$/;
  if (!regex.test(selectedQuantity.value) || selectedQuantity.value < 1) {
    selectedQuantity.value = 1;
  }

  if ( selectedQuantity.value  >= quantity.value) {
    selectedQuantity.value = quantity.value
  }
};

const getDetailProduct = async (slug)=> {
    
   const res =  await request.get(`product/getProductById/${slug}`)
   const productRes = res.data.data
   product.value = productRes.product
   variants.value = productRes.variants
   imagesQueue.value = productRes.product.images
   sizes.value = getAllSizes(variants.value);
// Lấy danh sách colors từ mảng variants
    colors.value = getAllColors(variants.value);
    totalQuantity.value = variants.value.reduce((total, variant) => total + variant.quantity, 0);
}


const getAllSizes = (variants) => {
  const seenSizes = {};
  const uniqueSizes = [];

  variants.forEach((variant) => {
    const size = variant.sizeId.name;

    if (!seenSizes[size]) {
      uniqueSizes.push({ label: size, value: size });
      seenSizes[size] = true;
    }
  });

  return uniqueSizes;
};

const getAllColors = (variants) => {
  const seenColors = {};
  const uniqueColors = [];

  variants.forEach((variant) => {
    const color = variant.colorId.name;

    if (!seenColors[color]) {
      uniqueColors.push({ label: color, value: color });
      seenColors[color] = true;
    }
  });

  return uniqueColors;
};


getDetailProduct(slug)

const handleAddProductToCart= async ()=>{


  if(selectedColor.value==null || selectedSize.value === null || !selectedQuantity.value ){
    toast.add({ title: 'Vui lòng chọn đầy đủ thông tin', timeout: 4000, color: 'red' })
    validate.value = false
  }
  const selectedVariant = variants.value.find(
        variant => variant.sizeId.name === selectedSize.value && variant.colorId.name === selectedColor.value
    );
  const value = {
        user: auth.userq._id,
        cartItems: [
            {
                product: product.value._id,
                variant: selectedVariant._id,
                quantity: selectedQuantity.value
            }
        ]

  };
    if(!enableSizes.value.includes(selectedSize.value)){
    validate.value = false
  }
  if(!auth.userq._id){
    toast.add({ title: "Vui long dang nhap", color:'red', timeout: 2000 })
    validate.value = false
    navigateTo("/auth/login")
    return
  }
  
  validate.value = true
    if(validate.value) {
        await cart.addToCart(value)
        if(cart.errorMessage){
        toast.add({ title: cart.errorMessage, color:"red", timeout: 2000 })
        return
        }
        toast.add({ title: "Thêm sản phẩm vào giỏ hàng thành công", timeout: 2000 })
        await cart.getCarts()
    }
 
      
  


}
</script>

<style>

</style>