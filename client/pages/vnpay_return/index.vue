<template>
    <div v-if="codeRespone">
        <div v-if="codeRespone === '00'">
            Cảm ơn quý khách đã mua hàng, vui lòng theo dõi đơn hàng
            <ULink class="underline" to="/profile/orders-detail">
                Tại đây
            </ULink>

        </div>
        <div v-else class="text-red-300">
            Thanh toán thất bại, vui lòng kiểm tra lại.
            Bạn sẽ được chuyển đến trang chủ trong <span class="underline">{{ countdown }}</span> giây
            hoặc <ULink class="underline" to="/">
                chuyển hướng ngay
            </ULink>
        </div>
        
        
    </div>
</template>

<script setup>
import request from "~/utils/request";

const route = useRoute()

const codeRespone = ref()
const errorMessage = ref()
const countdown = ref(6);
console.log(route.query);
const getResultPayment = async()=>{
    try {
        const responseToHandleOrder = await request.get('payment/vnpay_ipn', {
            params: route.query
        })
        const response = await request.get('payment/vnpay_return', {
            params: route.query
        });

        console.log(response.data);
        codeRespone.value = response.data.code
        if (response.data.code !== "00") {
           countdownHandler()
        }
    } catch (error) {
        errorMessage.value = error
    }
}

const countdownHandler = () => {
  countdown.value -= 1; 
  if (countdown.value === 0) {
    
    navigateTo("/")
  } else {
    setTimeout(countdownHandler, 1000);
  }
};
onMounted(() => {
    getResultPayment()
})
</script>

<style lang="scss" scoped>

</style>