<script setup>
import { authStore } from '~/stores/auth';
import * as yup from 'yup'
import { errorMessage } from '../../utils/validation'
import MainLayout from '~/layouts/MainLayout.vue';
useHead(() => {
  return {
    title: 'NVH - Đăng Ký',
  };
});
const schema = yup.object({
  username: yup.string().required(errorMessage.requireUsername).min(6, errorMessage.minUsername),
  email: yup.string().required(errorMessage.requireEmail).email(errorMessage.isEmail),
  password: yup.string().required(errorMessage.requirePassword).min(6, errorMessage.minPassword),
  cfPassword: yup.string().required(errorMessage.requirePassword).min(6, errorMessage.minPassword).oneOf([yup.ref('password'), null], errorMessage.passwordMatch),
})

const state = ref({
  username: undefined,
  email: undefined,
  password: undefined,
  cfPassword: undefined
})
const auth = authStore()
const toast = useToast()

const onRegister = async (value) => {
  await auth.register(value.data)
  if (!auth.errorMessage) {
    toast.add({ title: 'Đăng ký thành công, vui lòng kiểm tra mail để xác nhận', timeout: 1000 })
  } else {
    toast.add({ title: auth.errorMessage, timeout: 3000, color: "red"})
    return 0
  }
}

</script>

<template>
  <MainLayout>
    <div class="flex justify-center items-center">
      <div class="my-10">
        <h3 class="my-5 text-center">Đăng ký</h3>
        <div>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onRegister">
                <UFormGroup label="Tài khoản" name="username">
                    <UInput v-model="state.username" />
                </UFormGroup>
                <!-- <ErrorMessage name="username" class="text-red-500" /> -->
                <UFormGroup label="Email" name="email">
                    <UInput v-model="state.email" />
                </UFormGroup>
                <!-- <ErrorMessage name="username" class="text-red-500" /> -->
                <UFormGroup label="Mật khẩu" name="password">
                    <UInput v-model="state.password" type="password" />
                </UFormGroup>
                <!-- <ErrorMessage name="username" class="text-red-500" /> -->
                <UFormGroup label="Nhập lại mật khẩu" name="cfPassword">
                    <UInput v-model="state.cfPassword" type="password" />
                </UFormGroup>
            <!-- <ErrorMessage name="password" class="text-red-500" /> -->
            <!-- <span v-show="isError" class="text-red-500">{{ auth.errorMessage }}</span> -->
            <div class="flex items-center justify-between">
                <UButton type="submit">
                    Đăng ký
                </UButton>
            </div>
            <p class="mt-5">
              Đã có tài khoản?
              <ULink
                to="/auth/login"
                inactive-class="text-blue-500 hover:underline"
              >
                    đăng nhập
                </ULink>
              ngay
            </p>
          </UForm>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

