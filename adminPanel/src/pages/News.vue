<template>
  <div>
    <div class="font-bold text-[18px]">QUẢN LÝ TIN TỨC</div>
    <div class="flex justify-end mt-5 mb-5">
      <a-button @click="showModal" type="primary"> Thêm tin tức </a-button>
    </div>
    <div>
      <ItemNews
        v-for="post in listNews"
        :key="post.id"
        :post="post"
        @delete-news="deleteNew($event)"
        @open-update="openUpdate($event)"
      />
      <ModalNews
        ref="modalNews"
        :show="show"
        :title="title"
        :buttonText="buttonText"
        :mode="mode"
        :formState="formState"
        @cancel="cancel()"
        @create-news="create($event)"
        @update-news="update($event)"
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
import ModalNews from "../components/news/ModalNews.vue";
import ItemNews from "../components/news/ItemNews.vue";
import {
  getAllNews,
  createNews,
  deleteNews,
  updateNews,
} from "../request/news";
import { ref, reactive, inject, onBeforeMount, watch } from "vue";
import { message } from "ant-design-vue";
const modalNews = ref(null);
const user = inject("user");
const show = ref(false);
const title = ref("");
const buttonText = ref("");
const listNews = ref("");
const mode = ref("");
const formState = reactive({
  titleNews: "",
  editorNews: "",
});
const pagination = ref({
  page: 1,
  limit: 5,
  total: 0,
});

const showModal = () => {
  title.value = "Thêm tin tức";
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
  const res = await getAllNews({
    limit: pagination.value.limit,
    page: pagination.value.page,
  });
  pagination.value = {
      ...pagination.value,
      total: res.data.total,
    };
  listNews.value = res?.data?.data;
};
const create = async (data) => {
  try {
    const res = await createNews({
      title: data.titleNews,
      content: data.editorNews,
      author: user?.value?.username,
      publishedAt: new Date(),
    });
    if (res?.status == 200) {
      successMes(res.data.success);
      cancel();
      getAll();
    }
  } catch (error) {
    errorMes("Đã có lỗi xảy ra");
  }
};
const update = async (data) => {
  try {
    const res = await updateNews(data.id, {
      title: data.titleNews,
      content: data.editorNews,
    });
    if (res?.status == 200) {
      successMes(res.data.success);
      cancel();
      getAll();
    }
  } catch (error) {
    errorMes("Đã có lỗi xảy ra");
  }
};
const deleteNew = async (id) => {
  try {
    const res = await deleteNews(id);
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
  title.value = "Cập nhật tin tức";
  buttonText.value = "Cập nhật";
  show.value = true;
  mode.value = "update";
  formState.id = data._id;
  formState.titleNews = data.title;
  formState.editorNews = data.content;
};
const successMes = (mes) => {
  message.success(mes);
};
const errorMes = (mes) => {
  message.error(mes);
};
</script>
