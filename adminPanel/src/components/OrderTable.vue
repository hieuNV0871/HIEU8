<template>
  <a-table
    :columns="columns"
    :data-source="data"
    :pagination="false"
    class="components-table-demo-nested"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'totalPrice'">
        <span>
          {{
            record.totalPrice.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })
          }}
        </span>
      </template>
      <template v-if="column.key === 'createdAt'">
        <span>
          {{ moment(String(record.createdAt)).format("DD/MM/YYYY") }}
        </span>
      </template>
      <template v-if="column.key === 'status'">
        <span>
          <a-tag :color="color[record.status]">
            {{
              record.status == 0
                ? "Đã đặt hàng"
                : record.status == 1
                ? "Đã giao cho shipper"
                : record.status == 2
                ? "Đang giao hàng"
                : "Thành công"
            }}
          </a-tag>
        </span>
      </template>
      <template v-if="column.key === 'action'">
        <a-button type="primary" @click="openUpdate(record)">Cập nhật</a-button>
      </template>
    </template>
    <template #expandedRowRender="{ record }">
      <a-table
        :columns="innerColumns"
        :data-source="record.ordersItems"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'product.name'">
            <span>
              {{ record.product.name }}
            </span>
          </template>
          <template v-if="column.key === 'product.price'">
            <span>
              {{
                record.product.price.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })
              }}
            </span>
          </template>
          <template v-if="column.key === 'product.description'">
            <span v-html="record.product.description">
            </span>
          </template>
        </template>
      </a-table>
    </template>
  </a-table>
</template>
<script setup>
import moment from "moment";
import { ref } from "vue";
const props = defineProps({
  data: [Array, Object],
});
const emit = defineEmits(["open-update"]);

const columns = [
  {
    title: "Họ tên",
    dataIndex: "user?.name",
    key: "user?.name",
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Tổng tiền",
    dataIndex: "totalPrice",
    key: "totalPrice",
  },
  {
    title: "Ngày đặt",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "Phương thức thanh toán",
    dataIndex: "paymentMethod",
    key: "paymentMethod",
  },

  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Cập nhật",
    dataIndex: "action",
    key: "action",
  },
];
const innerColumns = [
  { title: "Tên sản phẩm", key: "product.name", width: "30%" },
  { title: "Giá", key: "product.price" },
  { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
  {
    title: "Mô tả",
    width: "40%",
    key: "product.description",
  },
];
const openUpdate = (id) => {
  emit("open-update", id);
};
const color = ref(["blue", "orange", "red", "green"]);
</script>
