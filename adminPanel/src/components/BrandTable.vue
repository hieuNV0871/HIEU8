<template>
  <a-table :columns="columns" :data-source="data" :pagination="false">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <span>
          <a-button class="bg-orange-500" @click="update(record)"
            >Cập nhật</a-button
          >
          <a-button class="bg-red-500" @click="showDeleteConfirm(record._id)"
            >Xóa</a-button
          >
        </span>
      </template>
    </template>
  </a-table>
</template>
<script setup>
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode } from "vue";
import { Modal } from "ant-design-vue";
const emit = defineEmits(["open-update", "delete-brand"]);
const props = defineProps({
  data: [Array, Object],
});

const columns = [
  {
    title: "Tên",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Position",
    key: "position",
    dataIndex: "position",
  },
  {
    title: "Thao tác",
    key: "action",
  },
];

const update = (id) => {
  emit("open-update", id);
};
const showDeleteConfirm = (id) => {
  Modal.confirm({
    title: "Bạn chắc chắn muốn xóa?",
    icon: createVNode(ExclamationCircleOutlined),
    okText: "OK",
    okType: "danger",
    cancelText: "Hủy",
    onOk() {
      emit("delete-brand", id);
    },
    onCancel() {},
  });
};
</script>
