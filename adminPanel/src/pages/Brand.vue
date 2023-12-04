<template>
  <div>
    <div class="font-bold text-[18px]">QUẢN LÝ THƯƠNG HIỆU</div>
    <div class="flex justify-end mt-5 mb-5">
      <a-button @click="showModal" type="primary"> Thêm thương hiệu </a-button>
    </div>
    <div>
      <BrandTable
        :data="listData"
        @open-update="openUpdate($event)"
        @delete-brand="deleteBrand($event)"
      />
      <BrandModal
        :show="show"
        :title="title"
        :buttonText="buttonText"
        :mode="mode"
        :formState="formState"
        :data="listData"
        @cancel="cancel()"
        @create-record="create($event)"
        @update-record="update($event)"
      />
    </div>
    <div class="mt-10 text-center">
      <a-pagination
        v-model:current="pagination.page"
        :pageSize="pagination.limit"
        :total="pagination.total"
        show-less-items
      />
    </div>
  </div>
</template>

<script setup>
import BrandTable from "../components/BrandTable.vue";
import BrandModal from "../components/BrandModal.vue";
import { ref, reactive, onBeforeMount, watch } from "vue";
import { message } from "ant-design-vue";
import * as ApiBrand from "../request/brand.js";
const show = ref(false);
const title = ref("");
const buttonText = ref("");
const listData = ref([]);
const mode = ref("");
const formState = reactive({
  name: "",
  position: "",
});
const pagination = ref({
  page: 1,
  limit: 5,
  total: 0,
});

const showModal = () => {
  title.value = "Thêm thương hiệu";
  buttonText.value = "Thêm";
  show.value = true;
  mode.value = "create";
};
watch(
  () => pagination.value.page,
  () => {
    getAll();
  }
);
onBeforeMount(() => {
  getAll();
});
const getAll = async () => {
  const res = await ApiBrand.getAll({
    limit: pagination.value.limit,
    page: pagination.value.page,
  });
  pagination.value = {
      ...pagination.value,
      total: res.data.total,
    };
  listData.value = res?.data?.data;
};
const create = async (data) => {
  try {
    const res = await ApiBrand.createBrand({
      name: data.name,
      position: data.position,
    });
    successMes(res.data.success);
    cancel();
    getAll();
  } catch (error) {
    errorMes("Đã có lỗi xảy ra");
  }
};
const update = async (data) => {
  try {
    const res = await ApiBrand.updateBrand(data?.id,{
      name: data.name,
      position: data.position,
    });
    successMes(res.data.success);
    cancel();
    getAll();
  } catch (error) {
    errorMes("Đã có lỗi xảy ra");
  }
};
const deleteBrand = async (id) => {
  try {
    const res = await ApiBrand.deleteBrand(id);
    if (res?.status == 200) {
      successMes(res.data.success);
      cancel();
      getAll();
    }
  } catch (error) {
    errorMes("Đã có lỗi xảy ra");
  }
};
const cancel = () => {
  show.value = false;
};
const openUpdate = (data) => {
  title.value = "Cập nhật thương hiệu";
  buttonText.value = "Cập nhật";
  show.value = true;
  mode.value = "update";
  formState.id = data._id;
  formState.name = data.name;
  formState.position = data.position;
};
const successMes = (mes) => {
  message.success(mes);
};
const errorMes = (mes) => {
  message.error(mes);
};
</script>
