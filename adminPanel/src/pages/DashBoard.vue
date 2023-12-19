<template>
  <div v-if="auth.authUser.role === 9999">
      <div class="flex gap-x-5 mb-10">
        <a-space class="flex items-center">
          <h3>Loại biểu đồ:</h3>
          <a-select
          ref="select"
            v-model:value="chartType"
            style="width: 120px"
            :options="chartTypes"
          >
          </a-select>

          </a-space>
        <a-space class="flex items-center">
          <h3>Xem theo:</h3>
          <a-select
            ref="select"
            v-model:value="dateType"
            style="width: 80px"
            :options="dateTypes"
          >
          </a-select>
          </a-space>
          <div class="flex items-center gap-x-2">
            <h3>Từ:</h3>
            <VueDatePicker style="width: 200px;" v-model="dateF"  :enable-time-picker="false"></VueDatePicker>
          </div>
          <div class="flex items-center gap-x-2">
            <h3>Đến:</h3>
            <VueDatePicker style="width: 200px;" v-model="dateT"  :enable-time-picker="false"></VueDatePicker>
          </div>
          <div>
            <a-button @click="handleFilterStatistic">
              Lọc
            </a-button>
          </div>
      </div>
      <!-- <div v-if="resultRevenue">
        {{ resultRevenue }}

      </div> -->
      <div class="flex gap-x-5">
        <div v-if="resultRevenue">
          
          <Bar  v-if="chartType === 'Bar'" :style="chartStyles" :data="data" :options="options"/>
          <Line  v-if="chartType === 'Line'" :style="chartStyles" :data="data" :options="options"/>

          <!-- <DynamicChart/> -->
        </div>
        <div class="grid grid-cols-2 gap-5">
          <div class="flex items-center h-[100px] bg-slate-200 px-2 flex-col justify-center">
            <h3>Tổng số đơn hàng</h3>
            <h3>{{ totals.totalCancelledOrders + totals.totalSuccessfulOrders }}</h3>
          </div>
          <div class="flex items-center h-[100px] bg-slate-200 px-2 flex-col justify-center">
            <h3>Số đơn bị hủy</h3>
            <h3>{{ totals.totalCancelledOrders }}</h3>
          </div>
          <div class="flex items-center h-[100px] bg-slate-200 px-2 flex-col justify-center">
            <h3>Số đơn thành công</h3>
            <h3> {{ totals.totalSuccessfulOrders }}</h3>
          </div>
          <div class="flex items-center h-[100px] bg-slate-200 px-2 flex-col justify-center">
            <h3>Số sản phẩm bán ra</h3>
            <h3>{{ totals.totalQuantity }}</h3>
          </div>
        </div>
      </div>
      <div class="my-10">
    <h3 class="font-bold text-xl text-center mb-10">Top 5 sp ban chay:</h3>
    <table class="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th scope="col" class="px-6 py-3 bg-gray-50 text-left text-xs  text-black font-extrabold uppercase tracking-wider">STT</th>
          <th scope="col" class="px-6 py-3 bg-gray-50 text-left text-xs  text-black font-extrabold uppercase tracking-wider">Name</th>
          <th scope="col" class="px-6 py-3 bg-gray-50 text-left text-xs  text-black font-extrabold uppercase tracking-wider">SKU</th>
          <th scope="col" class="px-6 py-3 bg-gray-50 text-left text-xs  text-black font-extrabold uppercase tracking-wider">Price</th>
          <th scope="col" class="px-6 py-3 bg-gray-50 text-left text-xs  text-black font-extrabold uppercase tracking-wider">Total Quantity</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in resultHotProduct" :key="index" :class="{ 'bg-gray-100': index % 2 === 0, 'bg-white': index % 2 !== 0 }">
          <td class="px-6 py-4 whitespace-nowrap">{{ index + 1 }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ item.detail[0].name }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ item.detail[0].sku }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ item.detail[0].price.toLocaleString() }} VNĐ</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ item.totalQuantity }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted,h, toRefs, computed } from "vue";
import { authStore } from "../stores/auth";
import { getRevenue, getHotSellingProduct } from '../request/statistics'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Line, Bar} from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
)
const auth = authStore()

const dateF = ref();
const dateT = ref();
const dateTypes = ref([
      {
        value: 'day',
        label: 'Ngày',
      },
      {
        value: 'month',
        label: 'Tháng',
      },
      {
        value: 'year',
        label: 'Năm',
      },
])

const data = ref({
  labels: [],
  datasets: [
    {
      label: 'Tổng giao dịch',
      backgroundColor: '#0dc5ff',
      data: []
    },
    {
      label: 'Giao dịch bị hủy',
      backgroundColor: '#ff0000',
      data: []
    },
    {
      label: 'Giao dịch thành công',
      backgroundColor: '#22d933',
      data: []
    }
  ]
})
const chartType = ref('Bar')
const options = ref({
  responsive: true,
  // maintainAspectRatio: false
})
const chartStyles = ref({
  height: `300px`,
  width: '700px'
})
// const DynamicChart = computed(() => {
//   return h(chartType.value === 'Line' ? Line : Bar, { data: data.value, options: options.value , style: chartStyles.value});
// }, { data, options });
const { labels, datasets } = toRefs(data);
const { responsive } = toRefs(options);

const DynamicChart = computed(() => {
  return h(chartType.value === 'Line' ? Line : Bar, {
    data: { labels: data.value.labels, datasets: data.value.datasets },
    // options: options.value.responsive,
    style: chartStyles.value,
  });
}, { labels, datasets, responsive });

const chartTypes = ref([
      {
        value: 'Bar',
        label: 'Cột',
      },
      {
        value: 'Line',
        label: 'Đường kẻ',
      },
])
const dateType = ref("day")
const dateFrom = ref(dateF)
const dateTo = ref(dateT)
const resultRevenue = ref()
const resultHotProduct = ref()
const totals = ref({
  totalSuccessfulOrders: 0,
  totalCancelledOrders: 0,
  totalQuantity: 0
});
const getRevenueStatistics = async(type, dateFrom, dateTo) => {
  const res  = await getRevenue({
    type,
    dateFrom,
    dateTo
  })
  resultRevenue.value = res.data.revenue
  totals.value.totalSuccessfulOrders = 0;
  totals.value.totalCancelledOrders = 0;
  totals.value.totalQuantity = 0;

  res.data.revenue.map(rs=>{
    data.value.labels.push(rs.date)
    data.value.datasets[0].data.push(rs.totalAmount)
    data.value.datasets[1].data.push(rs.totalCancelledAmount)
    data.value.datasets[2].data.push(rs.totalSuccessfulAmount)
    totals.value.totalSuccessfulOrders += rs.successfulOrders;
    totals.value.totalCancelledOrders += rs.cancelledOrders;
    totals.value.totalQuantity += rs.totalQuantityProduct
  })

}

const getHotProductSellingStistics = async () => {
  const res = await getHotSellingProduct()
  resultHotProduct.value = res.data.hotSellingProduct
}
onMounted(()=>{
  getRevenueStatistics(dateType.value, dateFrom.value, dateTo.value) 
  getHotProductSellingStistics()
})

const handleFilterStatistic =  ()=>{
  data.value.labels = [];
  data.value.datasets.forEach(dataset => dataset.data = []);
   getRevenueStatistics(dateType.value, dateFrom.value, dateTo.value);
 
}






</script>
<style></style>
