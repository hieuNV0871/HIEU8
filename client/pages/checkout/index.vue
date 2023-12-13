<template>
    <MainLayout>
        <UContainer>
            <div>
                <div>
                    {{ cart.itemsToCheckout }}
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
                        {{ overallTotalPrice }}
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
const paymentMethods = ref(['COD', 'MOMO'])

const paymentMethod = ref('COD')

const itemsToCheckout = ref([]);



const handleCreateOrders = async(value)=>{
    const order = {
        name: value.data.name,
        user: cart.carts.user,
        address: value.data.address,
        phone: value.data.phoneNumber,
        paymentMethod: paymentMethod.value,
        status: paymentMethod.value === 'MOMO' ? 999 : 0,
        totalPrice: overallTotalPrice.value,
        ordersItems: extractedData
    }
    console.log(order);
    const res = await request.post("orders/create", order)
    const orderId = res.data.data._id
    if(paymentMethod.value === 'MOMO'){
      const reqData = {
        amount: overallTotalPrice.value,
        bankCode: 'NCB',
        orderDescription: "Thanh toan don hang cho cua hang NVH-SHOP",
        orderType: "other",
        language: "vn",
        orderId
      }
      console.log(reqData);
      const resUrl = await request.post("payment/create_payment_url", reqData )
      const url = resUrl.data.url
      navigateTo(url,{external:true} )
    }
    // const resPayment = await request.post("payment/momo", {order})
    // const resPayment2 = await request.post("payment/zalo", {order})
    // const url = resPayment.data.url
    // console.log(resPayment2);
    // navigateTo(url, { external: true })
    // const res =await request.post("orders/create", order)
    // await cart.getCarts()
    // if(res.data.success){
    //     toast.add({ title: 'Đặt hàng thành công, bạn sẽ chuyển đến chi tiết đơn hàng', timeout: 1000 })
    // }else{
    //     toast.add({ title: res.data.error, color: 'red', timeout: 1000 })
    // }
}

const extractedData = cart.itemsToCheckout.map(item => ({
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
  return calculateOverallTotalPrice(cart.itemsToCheckout);
});


</script>


<style>

</style>

