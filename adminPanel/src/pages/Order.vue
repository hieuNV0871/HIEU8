<template>
  <div>
    <div class="font-bold text-[18px]">QUẢN LÝ ĐƠN HÀNG</div>
    <a-button type="primary" @click="addOrders">add</a-button>

    <div>
      <OrderTable
        :data="listData"
        @open-update="openUpdate($event)"
        @delete-brand="deleteBrand($event)"
      />
      <div>
        <div class="mt-10 text-center">
          <a-pagination
            v-model:current="pagination.page"
            :pageSize="pagination.limit"
            :total="pagination.total"
            show-less-items
          />
        </div>
        <a-modal v-model:open="show" title="Cập nhật" @ok="update">
          <a-form-item label="Trạng thái đơn hàng">
            <a-select
              v-model:value="status"
              placeholder="Select a person"
              style="width: 200px"
              :options="options"
              @change="handleChange"
            ></a-select>
          </a-form-item>
        </a-modal>
      </div>
    </div>
  </div>
</template>

<script setup>
import OrderTable from "../components/OrderTable.vue";
import { ref, reactive, onBeforeMount, watch } from "vue";
import { message } from "ant-design-vue";
import * as ApiOrder from "../request/order.js";
import { useRouter } from "vue-router";

const router = useRouter();
const show = ref(false);
const listData = ref([]);
const formState = reactive({
  id: "",
});
const pagination = ref({
  page: 1,
  limit: 5,
  total: 0,
});
const status = ref(0);
onBeforeMount(() => {
  getAll();
});
const getAll = async () => {
  const res = await ApiOrder.getAll({
    limit: pagination.value.limit,
    page: pagination.value.page,
  });

  listData.value = res?.data?.data.map((e)=>({
    ...e,
    key: e._id,
    ordersItems: e.ordersItems.map((s)=>({
      ...s,
      key: e._id,
    }))
  }));

  pagination.value = {
      ...pagination.value,
      total: res.data.total,
    };

}
const handleChange = (value) => {
  status.value = value;
};
const update = async () => {
  try {
    const res = await ApiOrder.updateStatus({
      orderId: formState.id,
      status: status.value,
    });
    successMes(res.data.success);
    cancel();
    getAll();
  } catch (error) {
    errorMes("Đã có lỗi xảy ra");
  }
};
watch(
  () => pagination.value.page,
  () => {
    getAll();
  }
);
const cancel = () => {
  show.value = false;
};
const openUpdate = (data) => {
  show.value = true;
  formState.id = data._id;
  status.value = data.status;
};
const successMes = (mes) => {
  message.success(mes);
};
const errorMes = (mes) => {
  message.error(mes);
};
const options = ref([
  {
    value: 0,
    label: "Đã đặt hàng",
  },
  {
    value: 1,
    label: "Đã giao cho shipper",
  },
  {
    value: 2,
    label: "Đang giao hàng",
  },
  {
    value: 3,
    label: "Thành công",
  },
  {
    value: -1,
    label: "Hủy",
  },
]);

const addOrders = () => {
  router.push("/add-orders");
};
</script>
