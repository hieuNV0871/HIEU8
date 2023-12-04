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
        <a-form-item has-feedback label="Tên" name="username">
          <a-input
            v-model:value="formState.username"
            :disabled="mode == 'update' ? true : false"
            type="text"
            autocomplete="off"
          />
        </a-form-item>
        <a-form-item has-feedback label="Email" name="email">
          <a-input
            v-model:value="formState.email"
            :disabled="mode == 'update' ? true : false"
            type="text"
            autocomplete="off"
          />
        </a-form-item>
        <a-form-item
          has-feedback
          label="Password"
          name="password"
          v-if="mode == 'create'"
        >
          <a-input
            v-model:value="formState.password"
            :disabled="mode == 'update' ? true : false"
            type="text"
            autocomplete="off"
          />
        </a-form-item>
        <a-form-item label="Quyền" name="role">
          <a-select
            v-model:value="formState.role"
            placeholder="Select a person"
            style="width: 200px"
            :options="options"
            @change="handleChange"
          ></a-select>
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
  username: [
    {
      required: true,
      message: "Vui lòng điền trường này",
      trigger: "change",
    },
    {
      min: 6,
      message: "Tối thiểu 6 kí tự",
      trigger: "change",
    },
  ],
  email: [
    {
      required: true,
      message: "Vui lòng điền trường này",
      trigger: "change",
    },
    {
      email: true,
      message: "Phải là email",
      trigger: "change",
    },
  ],
  password: [
    {
      required: true,
      message: "Vui lòng điền trường này",
      trigger: "change",
    },
    {
      min: 6,
      message: "Tối thiểu 6 kí tự",
      trigger: "change",
    },
  ],
  role: [
    {
      required: true,
      message: "Vui lòng điền trường này",
      trigger: "change",
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
const options = ref([
  {
    value: 0,
    label: "Khách hàng",
  },
  {
    value: 1,
    label: "Nhân viên",
  },
  {
    value: 9999,
    label: "Admin",
  },
]);
</script>
