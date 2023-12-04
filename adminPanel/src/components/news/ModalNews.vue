<template>
  <div>
    <a-modal
      v-model:open="open"
      width="1000px"
      height="calc(100vh - 200px)"
      :title="title"
      @cancel="handleCancel"
      :maskClosable="false"
      footer=""
    >
      <a-form
        ref="formRef"
        name="custom-validation"
        :model="formState"
        :rules="rules"
        layout="vertical"
      >
        <a-form-item has-feedback label="Tiêu đề tin tức" name="titleNews">
          <a-input
            v-model:value="formState.titleNews"
            type="text"
            autocomplete="off"
          />
        </a-form-item>
        <a-form-item label="Nội dung tin tức" name="editorNews">
          <ckeditor :editor="editor" v-model="formState.editorNews" />
        </a-form-item>
        <a-form-item class="text-end">
          <a-button
            class="mr-5"
            type="primary"
            html-type="submit"
            @click="onSubmit"
            >{{ buttonText }}</a-button
          >
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script setup>
import { ref, reactive, watch } from "vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const editor = ref(ClassicEditor);
const props = defineProps({
  show: [Boolean],
  title: [String],
  buttonText: [String],
  mode: [String],
  formState: [Array, Object],
});
const emit = defineEmits(["cancel", "create-news", "update-news"]);

const open = ref(false);
const formRef = ref();
const rules = {
  titleNews: [
    {
      required: true,
      message: "Vui lòng điền trường này",
      trigger: "change",
    },
    {
      min: 2,
      message: "Số lương kí tự phải lớn hơn 2",
      trigger: "blur",
    },
  ],
  editorNews: [
    {
      required: true,
      message: "Vui lòng điền trường này",
      trigger: "change",
    },
    {
      min: 10,
      message: "Số lương kí tự phải lớn hơn 50",
      trigger: "blur",
    },
  ],
};
const onSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      handleSubmit(props.formState);
    })
    .catch((error) => {
      console.log("error", error);
    });
};
const handleSubmit = (formState) => {
  if (props.mode == "create") {
    emit("create-news", formState);
  } else {
    emit("update-news", formState);
  }
};
const handleCancel = (e) => {
  formRef.value.resetFields();
  emit("cancel");
};

watch(
  () => props.show,
  (newValue) => {
    open.value = newValue;
  }
);
</script>
