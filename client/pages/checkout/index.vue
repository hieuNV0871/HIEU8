<template>
    <MainLayout>
        <UContainer>
            <div>
                <div>
                    <!-- {{ cart.carts }} -->
                </div>
                <div>
                    <UForm :state="state" class="space-y-4" @submit="handleCreateOrders">
                        <UFormGroup label="Họ tên" name="name">
                        <UInput v-model="state.name" />
                        </UFormGroup>
                        <UFormGroup label="SĐT" name="phoneNumber">
                        <UInput v-model="state.phoneNumber" />
                        </UFormGroup>
                        <UFormGroup label="Địa chỉ" name="address">
                        <UInput v-model="state.address" />
                        </UFormGroup>
                        <USelect v-model="paymentMethod" :options="paymentMethods" />
                        <UButton type="submit">
                            Đặt hàng
                        </UButton>
                    </UForm>
                </div>
            </div>
        </UContainer>
    </MainLayout>
</template>

<script setup>
import MainLayout from '../layouts/MainLayout.vue';
import  request  from '../../utils/request';
// definePageMeta({
// middleware: [
// function (to, from) {
//   // Custom inline middleware
// },
// 'auth',
// ],
// });

useHead(() => {
return {
title: 'NVH - Thanh toan ',
};
});
const cart = cartStore()
const toast = useToast()

const state = ref({
    name: undefined,
    address: undefined,
    phoneNumber: undefined,
})
const paymentMethods = ['COD', 'MOMO']

const paymentMethod = ref('COD')


const handleCreateOrders = async(value)=>{
    const order = {
        name: value.data.name,
        user: cart.carts.user,
        address: value.data.address,
        phone: value.data.phoneNumber,
        paymentMethod: paymentMethod.value,
        status: 0,
        totalPrice: overallTotalPrice.value,
        ordersItems: extractedData
    }
    const resPayment = await request.post("payment/momo", {order})
    // const resPayment2 = await request.post("payment/zalo", {order})
    const url = resPayment.data.url
    // console.log(resPayment2);
    navigateTo(url, { external: true })
    // const res =await request.post("orders/create", order)
    // await cart.getCarts()
    // if(res.data.success){
    //     toast.add({ title: 'Đặt hàng thành công, bạn sẽ chuyển đến chi tiết đơn hàng', timeout: 1000 })
    // }else{
    //     toast.add({ title: res.data.error, color: 'red', timeout: 1000 })
    // }
}

const extractedData = cart.carts.cartItems.map(item => ({
  product: item.product,
  variant: item.variant._id,
  quantity: item.quantity
}));

const calculateOverallTotalPrice = (cartItems) => {
  return cartItems.reduce((total, item) => {
    if (item && item.variant && item.variant.productId && item.variant.productId.price) {
      return total + item.quantity * item.variant.productId.price;
    }
    return total;
  }, 0);
};

const overallTotalPrice = computed(() => {
  return calculateOverallTotalPrice(cart.carts.cartItems);
});
</script>

