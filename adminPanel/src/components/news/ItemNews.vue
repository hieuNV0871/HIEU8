<template>
  <a-card class="mb-5">
    <a-row justify="start" align="middle">
      <a-col :flex="4">
        <a-row justify="start" class="">
          <a-avatar>{{ post.author[0] }}</a-avatar>
          <span class="ml-2 translate-y-[15%]">{{ post.author }}</span>
        </a-row>
        <p class="mt-2">
          {{ moment(String(post.publishedAt)).fromNow() }}
        </p>
      </a-col>

      <a-col :flex="1">
        <a-row justify="end">
          <a-popover placement="bottom" trigger="click">
            <template #content>
              <p class="font-bold cursor-pointer" @click="update(post)">
                Sửa tin tức
              </p>
              <p
                class="font-bold cursor-pointer"
                @click="showDeleteConfirm(post._id)"
              >
                Xóa tin tức
              </p>
            </template>
            <a-button> <dash-outlined /></a-button>
          </a-popover>
        </a-row>
      </a-col>
    </a-row>
    <a-divider />

    <div class="">
      <h3 class="">{{ post.title }}</h3>
      <p class="" v-html="post.content"></p>
    </div>
  </a-card>
</template>

<script setup>
import moment from "moment";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode } from "vue";
import { Modal } from "ant-design-vue";
import { DashOutlined } from "@ant-design/icons-vue";
const props = defineProps({
  post: [Object, Array],
});
const emit = defineEmits(["open-update", "delete-news"]);
const update = (post) => {
  emit("open-update", post);
};
const showDeleteConfirm = (id) => {
  Modal.confirm({
    title: "Bạn chắc chắn muốn xóa tin tức này?",
    icon: createVNode(ExclamationCircleOutlined),
    okText: "OK",
    okType: "danger",
    cancelText: "Hủy",
    onOk() {
      emit("delete-news", id);
    },
    onCancel() {},
  });
};
</script>
<style scoped></style>
