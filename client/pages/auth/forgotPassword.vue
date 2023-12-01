<script setup>

import * as yup from 'yup'
import { errorMessage } from '../../utils/validation'
import MainLayout from '~/layouts/MainLayout.vue';
import { authStore } from '~/stores/auth';
const toast = useToast()
const auth = authStore()
useHead(() => {
  return {
    title: 'NVH - Lấy lại mật khẩu',
  };
});
const schema = yup.object({
  email: yup.string().required(errorMessage.requireEmail).email(errorMessage.isEmail),
})

const state = ref({
  email: undefined,
})

const onForgotPass = async (value) => {
  await auth.forgotPass(value.data)
  if (!auth.errorMessage) {
    toast.add({ title: 'Gửi mail thành công, vui lòng kiểm tra', timeout: 1000 })
  } else {
    toast.add({ title: auth.errorMessage, timeout: 3000, color: "red"})
    return 0
  }
}
const onBack = () => {
  return navigateTo('/auth/login')
}
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
        <h3 class="my-5 text-center">Quên mật khẩu</h3>
        <div>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onForgotPass">
                <UFormGroup label="Email" name="email">
                    <UInput v-model="state.email" />
                </UFormGroup>    
            <!-- <ErrorMessage name="password" class="text-red-500" /> -->
            <!-- <span v-show="isError" class="text-red-500">{{ auth.errorMessage }}</span> -->
            <div class="flex items-center justify-between">
                <UButton type="submit">
                    Gửi mail
                </UButton>
            </div>
            <p class="mt-5">
              Chưa có tài khoản?
              <ULink
                to="/auth/register"
                inactive-class="text-blue-500 hover:underline"
              >
                    đăng ký
                </ULink>
              tại đây
            </p>
          </UForm>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

