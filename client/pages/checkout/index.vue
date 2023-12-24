<template>
    <MainLayout>
        <UContainer>
            <div class="flex gap-10">
                <div class="w-1/2 ">
                  <div v-for="(item, index) in cart.itemsToCheckout" :key="index" class="">
                    <div 
                      :class="index===cart.itemsToCheckout.length - 1 ? '' : 'border-b'"
                      class="flex justify-between items-center mt-5  pb-5 ">
                      <div>
                        <img :src="item.variant.productId.images[0].src" alt="" class="w-20 h-20">
                      </div>
                      <div>
                        <span>{{ item.variant.productId.name }}</span>
                        <span>{{ item.quantity }}</span>
                      </div>
                      <div>
                        <span>{{ item.variant.colorId.name }} - </span>
                        <span> {{ item.variant.sizeId.name }}</span>
                      </div>
                      <div>
                        {{ (item.quantity * item.variant.productId.price).toLocaleString() }} đ
                      </div>
                    </div>
                  </div>
                  <div class="flex justify-end font-bold">Tổng tiền: {{ overallTotalPrice.toLocaleString() }} đ</div>
                </div>
                
                <UDivider class="w-[20px]" label="nvh shop" color="gray" orientation="vertical" />
                <div class="w-1/2">
                    <UForm :state="state" class="space-y-4" @submit="handleCreateOrders">
                        <UFormGroup>
                          <UInput disabled placeholder="Thanh toan don hang cho cua hang NVH-SHOP" />
                        </UFormGroup>
                        <UFormGroup label="Họ tên" name="name">
                        <UInput v-model="state.name" />
                        </UFormGroup>
                        <UFormGroup label="SĐT" name="phoneNumber">
                        <UInput v-model="state.phoneNumber" />
                        </UFormGroup>
                        <UFormGroup label="Địa chỉ" name="address">
                        <UInput v-model="state.address" />
                        </UFormGroup>
                        <UFormGroup label="Phương thức thanh toán" name="paymentMethod">
                          <USelect v-model="paymentMethod" :options="paymentMethods" />
                        </UFormGroup>
                        <UFormGroup v-if="paymentMethod === 'MOMO'" label="Chọn ngân hàng" name="bankCode">
                          <USelect v-model="bankCode" :options="bankCodes" option-attribute="name"/>
                        </UFormGroup>
                        <span>9704198526191432198</span>
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

const bankCodes = ref([
  {
    name: "Ngân hàng NCB",
    value: "NCB"
  },
  {
    name: "Ngân hàng MB",
    value: "MBBANK",
    disabled: true
  },
  {
    name: "VISA",
    value: "VISA"
  },
  {
    name: "Ngân hàng BIDV",
    value: "BIDV",
    disabled: true
  },
])

const bankCode = ref('NCB')

const itemsToCheckout = ref([]);



const handleCreateOrders = async(value)=>{
  if(!state.value.name || !state.value.address || !state.value.phoneNumber){
    toast.add({ title: "dien thong tin di", color: 'red', timeout: 1000 })
    return
  }
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
        await cart.getCarts()
    if(res.data.success){
        toast.add({ title: 'Đặt hàng thành công, bạn sẽ chuyển đến chi tiết đơn hàng', timeout: 1000 })
        if(paymentMethod.value === "COD"){
          navigateTo("/profile/orders-detail")
        }
    }else{
        toast.add({ title: res.data.error, color: 'red', timeout: 1000 })
    }
    const orderId = res.data.data._id
    if(paymentMethod.value === 'MOMO'){
      const reqData = {
        amount: overallTotalPrice.value,
        bankCode: bankCode.value,
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
    cart.itemsToCheckout = []
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

