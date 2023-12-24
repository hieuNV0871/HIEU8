<template>
  <MainLayout>
    <!--  -->
    <div class="">
      <Swiper 
        :modules="[SwiperAutoplay, SwiperEffectCreative]" 
        :slides-per-view="1" :loop="true" :effect="'creative'"
        :autoplay="{
          delay: 4000,
          disableOnInteraction: true, 
        }" :creative-effect="{
        prev: {
          shadow: false,
          translate: ['-20%', 0, -1],
        },
        next: {
          translate: ['100%', 0, 0],
        },
        }"
      >
        <SwiperSlide v-for="slide in slideItems" :key="slide.src">
            <ULink :to="slide.to">
              <img :src="slide.src" :alt="slide.alt" class="w-full h-[500px]">
            </ULink>
        </SwiperSlide>
      </Swiper>
    </div>
    <!--  -->
    <UContainer class="my-20">
      <div class="flex justify-around items-center">
          <div v-for="(box, index) in boxItems" :key="index" class="flex items-center shadow-xl mx-4 p-4 rounded-2xl cursor-pointer transition-transform duration-500 ease-linear hover:-translate-y-5" >
             <div class='px-3 py-3 flex items-center'>
                 <UIcon :name="box.icon" color="red" class="text-xl"/>
              </div>
              <div class=''>
                <div class="font-semibold text-lg">{{ box.title }}</div>
                <div class="text-sm">{{ box.description }}</div>
              </div>
          </div>
      </div>
    </UContainer>

    <UContainer class="my-20">
      <h2 class="font-semibold text-2xl text-center text-gray-500 mb-5">Sản phẩm theo danh mục</h2>
      <UTabs v-if="items.length" :items="items" class="w-full">
        <template #item="{item}">
          <!-- <div class="flex gap-2 relative  p-5"> -->
            <swiper
              :slides-per-view="4"
              :space-between="30"
            >
            <swiper-slide v-for="(product, index) in item.content" :key="index">
              <UCard class="hover:shadow-2xl flex flex-col justify-between">
                <div class="py-0">
                  <div>
                    <ULink :to="`/product/${product.id}`">
                      <img class="" :src="product.src" alt="">
                    </ULink>
                  </div>
                  <UDivider label="hieunv"/>
                  <div class="text-center">
                      <h2 class="font-semibold text-xl">{{ product.name }}</h2>
                      <span class="text-slate-400">{{ product.price.toLocaleString() }} đ</span>
                  </div>
                </div>

                <template #footer>
                  <div class="flex gap-x-3 justify-center">
                    <UButton @click="handleOpenModalBuyNow(product.id)" class="w-[100px] flex justify-center" truncate color="black" variant="solid" label="Mua ngay">

                    </UButton>
                    <UModal v-model="isOpen" prevent-close :overlay="false">
                        <div class="p-4">
                          <div class="flex justify-between" v-if="itemModal">

                <div class="flex-1" v-if="itemModal">
                    <div>
                        <h2>{{ itemModal.name }}</h2>
                        <span>{{ Number(itemModal.price).toLocaleString() }} đ</span>
                    </div>
                    <div >
                        <div>
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
                        <div  class="my-3">
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
                        {{ selectedQuantity }}
                        <UButton @click="handleBuyNow" class="my-2">
                            Thanh toán
                        </UButton>
                    </div>
                    
                    <div>
                        <h3>
                            Chi tiết sản phẩm:
                        </h3>
                        <div v-html="itemModal.description">
                            
                        </div>
                    </div>
                </div>

                
            </div>
                        </div>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
                      </UModal>
                    <UTooltip to="/" text="Thêm vào giỏ hàng" :popper="{ arrow: true }">
                      <UButton to="/" class="w-[100px]" truncate color="black" variant="solid" label="Thêm vào giỏ hàng"></UButton>
                    </UTooltip>
                  </div>
                </template>
            </UCard>
            </swiper-slide>
            </swiper>
          <!-- </div> -->
        </template>
      </UTabs>
      <div class="flex justify-center items-center my-14">
        <UButton label="Xem tất cả" color="gray" to="/collections/all">
          <template #trailing>
            <UIcon name="i-heroicons-arrow-right-20-solid" />
          </template>
        </UButton>
      </div>

    </UContainer>

    <!-- <Swiper 
        :modules="[SwiperAutoplay, SwiperEffectCreative]" 
        :slides-per-view="4" :loop="false" :effect="'creative'"
        :pagination="{clickable:true}"
        :creative-effect="{
        prev: {
          shadow: false,
          translate: ['-100%', 0, -1],
        },
        next: {
          translate: ['100%', 0, 0],
        },
        }"
      >
        <SwiperSlide v-for="(product, index) in products" :key="index">
          <UCard class="hover:shadow-2xl">
            <div class="py-0">
              <div>
                <ULink to="/">
                  <img class="" src="https://product.hstatic.net/1000096703/product/2_c066ad1667ad4e729bb6325b5d5a04af_grande.jpg" alt="">
                </ULink>
              </div>
              <UDivider label="hieunv"/>
              <div class="text-center">
                  <h2 class="font-semibold text-xl">{{ product.name }}</h2>
                  <span class="text-slate-400">{{ product.price }} đ</span>
              </div>
            </div>
            <template #footer>
              <div class="flex gap-x-3">
                <UButton class="w-[100px] flex justify-center" truncate color="black" variant="solid" label="Mua ngay"></UButton>
                <UButton class="w-[100px]" truncate color="black" variant="solid" label="Thêm vào giỏ hàng"></UButton>
              </div>
            </template>
          </UCard>
        </SwiperSlide>
    </Swiper> -->    





  </MainLayout>
</template>

<script setup>
import MainLayout from '../layouts/MainLayout.vue';
import request from '~/utils/request';
const cart = cartStore()
const itemModal= ref()
useHead(() => {
  return {
    title: 'NVH - Trang chủ',
  };
});
const isOpen = ref(false)
const selectedColor = ref(null)
const selectedSize = ref(null)
const enableSizes = ref([])
const selectedQuantity = ref(1)
const quantity = ref(1)
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
const handleChooseSize = ()=>{
  selectedQuantity.value = 1
    console.log(selectedSize);
    console.log(selectedColor);
    const selectedVariant = variants.value.find(
        variant => variant.sizeId.name === selectedSize.value && variant.colorId.name === selectedColor.value
    );

    // Lấy số lượng của biến thể nếu tìm thấy
     quantity.value = selectedVariant ? selectedVariant.quantity : 0;
}

const handleChooseColor = ()=>{

    selectedQuantity.value = 1
    selectedSize.value = null
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
const variants = ref()
const sizes = ref()
const colors = ref()
const handleOpenModalBuyNow = async (id)=>{
  // console.log(id);
  isOpen.value = true
  const res =  await request.get(`product/getProductById/${id}`)
  itemModal.value = res.data.data.product

  variants.value = res.data.data.variants
  sizes.value = getAllSizes(variants.value);
    colors.value = getAllColors(variants.value);
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
const handleBuyNow =  async ()=>{
  const selectedVariant = variants.value.find(
          variant => variant.sizeId.name === selectedSize.value && variant.colorId.name === selectedColor.value
      );
      console.log(selectedVariant.variant);
      const variantsRes = await request.get(`product/getProductByVariant/${selectedVariant._id}`)
  const value = [
  {
    
    product: itemModal.value._id,
    variant: variantsRes.data.data,
    quantity: selectedQuantity.value
}
  ]
console.log(value);
  cart.setItemToCheckout(value)
  if(cart.itemsToCheckout.length > 0){

    navigateTo("/checkout")
  }
}
const slideItems = ref([
  {
    src: "https://res.cloudinary.com/ddjil4odw/image/upload/v1703058868/shorts_e3313b51be654e06a5047049830cb9a4_rh0xvr.webp",
    alt: "slide",
    to:"#"
  },
  {
    src: "https://res.cloudinary.com/ddjil4odw/image/upload/v1703058945/2_5f0595d93fd84fe7a4fef1e775d1a3a8_vhovwa.webp",
    alt: "slide",
    to:"#"
  },  {
    src: "https://res.cloudinary.com/ddjil4odw/image/upload/v1703058949/4_f16c2272b69c43a78f1f176ac1fa2105_is6wxb.webp",
    alt: "slide",
    to:"#"
  },
])

const boxItems = ref([
  {
    icon: "i-heroicons-shopping-cart",
    title: "Miễn phí vận chuyển",
    description: "mien phi van chuyen voi don hang >500k"
  },{
    icon: "i-heroicons-credit-card-20-solid",
    title: "Thanh toán trực tuyến",
    description: "Thanh toan de dang thong qua nhieu ngan hang"
  },{
    icon: "i-heroicons-wrench-screwdriver-20-solid",
    title: "Đổi trả dễ dàng",
    description: "Doi do tai tat ca cac cua hang tren toan quoc"
  },{
    icon: "i-heroicons-shield-check-20-solid",
    title: "Khách hàng VIP",
    description: "Uu dai dac biet danh cho cac khach hang than thiet"
  },
])

const items = ref([]);

const getParentCategory = async (limit) => {
  try {
    const res = await request.get(`category/get_all_parent?limit=${limit}`);
    const parentCategories = res.data.data;
    parentCategories.forEach((parentCategory) => {
      items.value.push({
        label: parentCategory.name,
        icon: 'i-heroicons-information-circle',
        content: [],
      });
    });
    
    await Promise.all(
      parentCategories.map(async (parentCategory, index) => {
        // Fetch products for the current category
        const productsRes = await request.get(
          `product/getProductByParentCategory/${parentCategory._id}`
        );
        const products = productsRes.data.data;
        
        // Populate the content property with the fetched products
        items.value[index].content = products.map((product) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          src: product.images[0].src
        }));
      })
      );
    } catch (error) {
      console.error(error);
    }
  };
  
  
getParentCategory(3);


</script>
