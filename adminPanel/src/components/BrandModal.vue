<template>
    <div>
      <a-modal
        v-model:open="open"
        width="1000px"
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
          <a-form-item has-feedback label="Tên" name="name">
            <a-input
              v-model:value="formState.name"
              type="text"
              autocomplete="off"
            />
          </a-form-item>
          <a-form-item has-feedback label="Position" name="position">
            <a-input
              v-model:value="formState.position"
              type="text"
              autocomplete="off"
            />
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
  
  const props = defineProps({
    show: [Boolean],
    title: [String],
    buttonText: [String],
    mode: [String],
    formState: [Array, Object],
  });
  const emit = defineEmits(["cancel", "create-record", "update-record"]);
  
  const open = ref(false);
  const formRef = ref();
  const rules = {
    name: [
      {
        required: true,
        message: "Vui lòng điền trường này",
        trigger: "change",
      }
    ],
    position: [
      {
        required: true,
        message: "Vui lòng điền trường này",
        trigger: "change",
      }
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
      emit("create-record", formState);
    } else {
      emit("update-record", formState);
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
  