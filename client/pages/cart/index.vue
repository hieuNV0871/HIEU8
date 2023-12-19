<template>
      <MainLayout>
          <UContainer>
            <!-- {{ itemsToCheckout }} -->
            <div class="flex justify-between gap-x-5 my-20 p-10" v-if="cart.carts.cartItems.length">
                <div class="w-1/4 h-full flex flex-col gap-y-3 px-5 py-2 bg-white shadow-2xl rounded">
                  <span
                    >Bạn đang có
                    <span class="text-primary">{{ cart.carts.cartItems.length }} </span> sản phẩm
                    trong giỏ hàng</span
                  >
                  <span
                    >Thành tiền:
                    <span class="text-primary">{{overallTotalPrice.toLocaleString()}}đ</span></span
                  >
                  <div class="flex flex-col gap-y-2 items-center">
                    <UButton variant="outline" @click="handlePassData">Đặt hàng ngay</UButton>
                    <UButton variant="outline" to="/collections/all">Mua thêm sản phẩm</UButton>
                  </div>
                </div>
              <div class="w-3/4">
                <input
                name="checkall"
                type="checkbox"
                v-model="selectedAll"
                @click="handleCheckAll"
              />
                <label class="ml-3" for="checkall">Chọn tất cả</label>
                <div v-for="(item, index) in cart.carts.cartItems" :key="item._id">
                  <div class="flex justify-between items-center gap-x-5 px-3 py-5">
                    <div class="flex justify-center items-center gap-x-3">
                      <input
                          type="checkbox"
                          :value="item.variant._id"
                          v-model="itemsSelected"
                        />
                      <div>
                        <img class="w-14 h-14" :src="item.variant.productId.images[0].src" alt="">
                      </div>
                      <div>
                        <h3>{{ item.variant.productId.name }}</h3>
                        <span>SKU: {{ item.variant.sku }}</span>
                      </div>
                    </div>
                    <div class="flex justify-between items-center gap-x-10">
                      <div class="flex flex-col">
                        <span>SIZE: {{ item.variant.sizeId.name }}</span>
                        <span>COLOR:{{ item.variant.colorId.name }}</span>
                      </div>
                      <div class="flex">
                        <UButton
                            icon="i-heroicons-minus"
                            size="xs"
                            color="primary"
                            square
                            variant="outline"
                            @click="handleChangeSelectedQuantity(item._id, 'minus')"
                        />
                        <UInput class="w-[100px] text-center mx-2" @change="handleValidateQuantity(item._id)" size="sm" v-model="item.quantity"/>
                        <UButton
                            icon="i-heroicons-plus"
                            size="xs"
                            color="primary"
                            square
                            variant="outline"
                            @click="handleChangeSelectedQuantity(item._id,'plus')"
                        />
                    </div>
                      <!-- <span>So luong {{ item.quantity }}</span> -->
                    </div>
                    <div class="flex gap-x-3 justify-between items-center">
                      <h3>Thành tiền: <span>{{ calculateTotalPrice(item).toLocaleString() }}</span></h3>
                      <UButton
                          icon="i-heroicons-trash"
                          size="sm"
                          color="red"
                          variant="solid"
                          :trailing="false"
                          @click="handleDeleteItem(item._id)"
                        />
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div v-else>
                Chưa có sản phẩm trong giỏ hàng
                <ULink
                  to="/collections/all"
                  active-class="text-primary"
                  inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  Mua sắm ngay
                </ULink>
            </div>
          </UContainer>
      </MainLayout>
</template>

<script setup>
import MainLayout from '../layouts/MainLayout.vue';
import {cartStore} from '../../stores/cart';
const cart = cartStore()
definePageMeta({
middleware: [
  function (to, from) {
    // Custom inline middleware
  },
  'auth',
],
});

useHead(() => {
return {
  title: 'NVH - Giỏ hàng',
};
});
const toast = useToast()
const itemsSelected = ref([]);
const selectedAll = ref(true);

const itemsToCheckout = ref(cart.carts.cartItems)

const handlePassData = () =>{
  if(itemsToCheckout.value.length <= 0){
    toast.add({ title: "Vui lòng chọn sản phẩm", color: 'red', timeout: 1000 })
    // return
  }else{
    cart.itemsToCheckout = itemsToCheckout.value
    // localStorage.setItem("123", itemsToCheckout.value)
    navigateTo('/checkout')

  }
  // cart.setItemToCheckout(itemsToCheckout.value)
  // console.log(itemsToCheckout);
}

const handleChangeSelectedQuantity =  async(id, type) => {
    const cartItem  = cart.carts.cartItems.find(item=>item._id === id)
    const isPlus = type === "plus";
    const isSubtract = type === "minus";
    console.log(id);
    if (isPlus && cartItem.quantity < cartItem.variant.quantity) {
        cartItem.quantity ++;
    }else if(isPlus && cartItem.quantity >= cartItem.variant.quantity){
      toast.add({ title: "Số lượng trong kho không đủ", color: 'red', timeout: 1000 })
    }
     else if (isSubtract && cartItem.quantity > 1) {
       
      cartItem.quantity -= 1;
    }else{
      toast.add({ title: "Tối thiểu là 1, nếu muốn xóa click vào icon thùng rác", color: 'red', timeout: 1000 })
    }
    const newCartItem =
    {
            user: cart.carts.user,
            cartItems:[
                {
                    product:cartItem.product,
                    variant:cartItem.variant._id,
                    quantity: cartItem.quantity
                }
            ]
            
    }
    await cart.updateCartItem(newCartItem)
}
const handleValidateQuantity = async(id) => {
  const cartItem  = cart.carts.cartItems.find(item=>item._id === id)

  const regex = /^[0-9]+$/;
  if (!regex.test(cartItem.quantity) || cartItem.quantity < 1) {
    cartItem.quantity = 1;
    toast.add({ title: "Tối thiểu là 1, nếu muốn xóa click vào icon thùng rác", color: 'red', timeout: 1000 })

  }
  if ( cartItem.quantity  >= cartItem.variant.quantity) {
    cartItem.quantity = cartItem.variant.quantity
    toast.add({ title: "Đã đạt số lượng tối đa trong kho", color: 'red', timeout: 1000 })

  }
  const newCartItem =
    {
            user: cart.carts.user,
            cartItems:[
                {
                    product:cartItem.product,
                    variant:cartItem.variant._id,
                    quantity: cartItem.quantity
                }
            ]
            
    }
  
  await cart.updateCartItem(newCartItem)
};

const handleDeleteItem = async(id)=>{
  const deleted = confirm("Chu y dang xoa san pham duoc check")
  
    if(deleted) {
       await cart.removeCartItem(id)
        toast.add({ title: 'Xoá sản phẩm thành công', timeout: 1000 })
        await cart.getCarts()
  }
}



const handleCheckAll = () => {
  itemsSelected.value = !selectedAll.value
    ? cart.carts.cartItems.map((p) => p.variant._id)
    : [];
};


watch(itemsSelected, () => {
  selectedAll.value = itemsSelected.value.length === cart.carts.cartItems.length;
});
watch(cart.carts.cartItems, () => {
  itemsSelected.value = cart.carts.cartItems.map((p) => p.variant._id);
}, { immediate: true });


watch(itemsSelected, (newSelectedItems) => {
  itemsToCheckout.value = cart.carts.cartItems.filter((item) => newSelectedItems.includes(item.variant._id));
});


const calculateTotalPrice = (item) => {
  if (item && item.variant && item.variant.productId && item.variant.productId.price) {
    return item.quantity * item.variant.productId.price;
  }
  return 0;
};

// const overallTotalPrice = computed(() => {
//   return cart.carts.cartItems.reduce((total, item) => {
//     return total + calculateTotalPrice(item);
//   }, 0);
// });


const overallTotalPrice = computed(() => {
  const selectedItems = cart.carts.cartItems.filter((item) => itemsSelected.value.includes(item.variant._id));

  return selectedItems.reduce((total, item) => {
    return total + calculateTotalPrice(item);
  }, 0);
});



</script>

