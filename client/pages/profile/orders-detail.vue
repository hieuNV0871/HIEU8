<template>
    <UserLayout>
        <UContainer>
            <div v-for="(orders, index) in myOrders" :key="index" >
              <div class="flex justify-between items-center">

                <div class="flex items-center gap-5 w-2/5">
                  <span @click="()=>handleShowOrderDetail(index)" class="border rounded-full w-5 h-5 flex justify-center items-center cursor-pointer"><span>{{ (!isOpenDetail || index !== showOrdersDetail)  ? "+" : "-" }}</span></span>
                  <div>
                    <h3>Người nhận: {{orders.name}}</h3>
                    <span>SĐT: {{ orders.phone }}</span>
                    <h3>Mã đơn: {{ orders._id }}</h3>
                  </div>
                </div>
                <div class="w-2/5">
                  <h3>Hình thức thanh toán: {{ orders.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : "Chuyển khoản" }}</h3>
                  <h3>Trạng thái: <span class="font-semibold">{{ orders.status == 0
                    ? "Đã đặt hàng, đang chờ vận chuyển"
                    : orders.status == 1
                    ? "Đã giao cho shipper"
                    : orders.status == 2
                    ? "Đang giao hàng"
                    : orders.status == -1
                    ? "Đã hủy"
                    : "Thành công" }}</span>
                  </h3>
                  <h3>Cần thanh toán: <span>{{ (orders.paymentMethod === "COD" && (orders.status !== 3 || orders.status !== -1)) ? orders.totalPrice.toLocaleString() + "đ" : "0đ"}}</span></h3>
                </div>
                <div class="w-1/5">
                  <UButton v-if="orders.status === 0" color="primary" variant="solid" @click="()=>handleCancelOrders(orders._id)">Hủy đơn hàng</UButton>
                </div>
              </div>
              <div v-if="showOrdersDetail === index && isOpenDetail">
                <span class="underline">
                  Chi tiết đơn hàng:
                </span>
                <div v-for="(item, index) in orders.ordersItems" :key="index">
                  <div class="flex justify-between">
                    <span><span>{{ index+1 }}. </span> {{ item.product.name }}</span>
                    <ULink :to="`/product/${item.product._id}`" class="hover:underline hover:text-primary">xem lại</ULink>
                    <span>
                      <span>phân loại: </span>
                      <span>{{ item.variant.sizeId.name }} - </span>
                      <span>{{ item.variant.colorId.name }}</span>
                    </span>
                    <span>Giá: {{ item.product.price.toLocaleString()}} đ </span>
                    <span>Số lượng: {{ item.quantity }}</span>
                  </div>
                </div>
              </div>
              <UDivider/>
            </div>
        </UContainer>
    </UserLayout>
</template>

<script setup>
import UserLayout from '~/layouts/UserLayout.vue';
import request from '../../utils/request'

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
    title: 'NVH - Chi tiet don hang',
  };
});

const toast = useToast()
const myOrders = ref([])
const showOrdersDetail = ref()
const isOpenDetail = ref(false)
const getAllPersonalOrder = async ()=>{
  const res = await request.get("orders/getPersonalOrders")
  myOrders.value = res.data.data
}


const handleCancelOrders=  async(id)=>{
  const check = confirm(`Bạn có chắc muốn hủy đơn hàng ${id}`)
  if(check){
    const res = await request.patch(`orders/cancel/${id}`)
    await getAllPersonalOrder()
    if(res.data.success){
      toast.add({ title: "Hủy đơn hàng thành công, xin lỗi vì quý khách không hài lòng", timeout: 1000 })
    }
    else{
      toast.add({ title: res.data.error, color:"red", timeout: 1000 })
    }
  }
}

const handleShowOrderDetail = (index) => {
  if (showOrdersDetail.value === index && isOpenDetail.value === true) {
    isOpenDetail.value = false
  } else {
    showOrdersDetail.value = index
    isOpenDetail.value = true
  }
}

onMounted(() => {
  getAllPersonalOrder()
})
</script>
