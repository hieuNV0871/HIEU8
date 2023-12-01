<script setup>

import * as yup from 'yup'
import { errorMessage } from '../../../utils/validation'
import MainLayout from '~/layouts/MainLayout.vue';
const route = useRoute()

import { authStore } from '~/stores/auth';
const auth = authStore()
const toast = useToast()
useHead(() => {
  return {
    title: 'NVH - Đổi mật khẩu',
  };
});
const schema = yup.object({
    password: yup.string().required(errorMessage.requirePassword).min(6, errorMessage.minPassword),
    cfPassword: yup.string().required(errorMessage.requirePassword).min(6, errorMessage.minPassword).oneOf([yup.ref('password'), null], errorMessage.passwordMatch),
})

const state = ref({
cfPassword: undefined,
  password: undefined
})

const onResetPassword = async (value) => {
    const {reset_token} = route.params
    const vl = value.data
  await auth.resetPassword(vl, reset_token)
  if (!auth.errorMessage) {
    toast.add({ title: 'Đổi mật khẩu thành công, bạn sẽ được chuyển đến trang đăng nhập', timeout: 1000 })
    setTimeout(() => {
      navigateTo("/auth/login")
    }, 2000);
  } else {
    toast.add({ title: auth.errorMessage, timeout: 3000, color: "red"})
    return 0
  }
}
const onBack = () => {
  return navigateTo('/auth/login')
}
// definePageMeta({
//   middleware: [
//     function (to, from) {
//       // Custom inline middleware
//     },
//     'auth',
//   ],
// });
</script>

<template>
  <MainLayout>
    <div class="flex justify-center items-center">
      <div class="my-10 relative">
        <div @click="onBack" class='absolute cursor-pointer top-[20px] p-1'>
            <UTooltip text="Quay lại đăng nhập" :popper="{ offsetDistance: 10, placement: 'top'}">
              <UIcon name="i-heroicons-chevron-double-left"/>
            </UTooltip>
          </div>
        <h3 class="my-5 text-center">Đổi mật khẩu</h3>
        <div>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onResetPassword">
        
                <UFormGroup label="Mật khẩu" name="password">
                    <UInput v-model="state.password" type="password" />
                </UFormGroup>

                <UFormGroup label="Nhập lại mật khẩu" name="cfPassword">
                    <UInput v-model="state.cfPassword" type="password" />
                </UFormGroup>
            <!-- <ErrorMessage name="password" class="text-red-500" /> -->
            <!-- <span v-show="isError" class="text-red-500">{{ auth.errorMessage }}</span> -->
            <div class="flex items-center justify-between">
                <UButton type="submit">
                    Thay đổi mật khẩu
                </UButton>
                
            </div>
          </UForm>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

