<template>
  <div>
    <div class="font-bold text-[18px]">QUẢN LÝ NGƯỜI DÙNG</div>
    <div class="flex justify-end mt-5 mb-5">
      <a-button @click="showModal" type="primary"> Thêm người dùng </a-button>
    </div>
    <div>
      <UserTable
        :data="listData"
        @open-update="openUpdate($event)"
        @delete-user="deleteUser($event)"
      />
      <UserModal
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
import UserTable from "../components/UserTable.vue";
import UserModal from "../components/UserModal.vue";
import { ref, reactive, onBeforeMount, watch } from "vue";
import { message } from "ant-design-vue";
import * as ApiUser from "../request/user.api.js";
const show = ref(false);
const title = ref("");
const buttonText = ref("");
const listData = ref([]);
const mode = ref("");
const formState = reactive({
  username: "",
  email: "",
  password: "",
  role: "",
});
const pagination = ref({
  page: 1,
  limit: 5,
  total: 0,
});

const showModal = () => {
  title.value = "Thêm người dùng";
  buttonText.value = "Thêm";
  show.value = true;
  mode.value = "create";
  formState.username = "";
  formState.email = "";
  formState.password = "";
  formState.role = "";
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
  const res = await ApiUser.getAll({
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
    const res = await ApiUser.createUser({
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role,
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
    const res = await ApiUser.updateUser(data?.id, {
      role: data.role,
    });
    successMes(res.data.success);
    cancel();
    getAll();
  } catch (error) {
    errorMes("Đã có lỗi xảy ra");
  }
};
const deleteUser = async (id) => {
  try {
    const res = await ApiUser.deleteUser(id);
    if (res?.status == 200) {
      successMes(res.data.success);
      cancel();
      getAll();
    }
  } catch (error) {
    alert(error.message);
    errorMes("Đã có lỗi xảy ra");
  }
};
const cancel = () => {
  show.value = false;
};
const openUpdate = (data) => {
  title.value = "Cập nhật người dùng";
  buttonText.value = "Cập nhật";
  show.value = true;
  mode.value = "update";
  formState.id = data._id;
  formState.username = data.username;
  formState.email = data.email;
  formState.password = data.password;
  formState.role = data.role;
};
const successMes = (mes) => {
  message.success(mes);
};
const errorMes = (mes) => {
  message.error(mes);
};
</script>
