<template>
    <div v-if="codeRespone">
        <div v-if="codeRespone === '00'">
            Cảm ơn quý khách đã mua hàng, vui lòng theo dõi đơn hàng
            <ULink class="underline" to="/profile/orders-detail">
                Tại đây
            </ULink>

        </div>
        <div v-else class="text-red-300">
            Thanh toán thất bại, vui lòng kiểm tra lại
        </div>
        
        
    </div>
</template>

<script setup>
import request from "~/utils/request";

const route = useRoute()

const codeRespone = ref()
const errorMessage = ref()
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
    } catch (error) {
        errorMessage.value = error
    }
}

onMounted(() => {
    getResultPayment()
})
</script>

<style lang="scss" scoped>

</style>