<script setup>

import * as yup from 'yup'
import { errorMessage } from '../../utils/validation'
import MainLayout from '~/layouts/MainLayout.vue';
import {GoogleSignInButton} from "vue3-google-signin"
import { authStore } from '~/stores/auth';
import { cartStore } from '~/stores/cart';

useHead(() => {
  return {
    title: 'NVH - Đăng Nhập',
  };
});
const auth = authStore()
const cart = cartStore()
const schema = yup.object({
  username: yup.string().required(errorMessage.requireUsername).min(6, errorMessage.minUsername),
  password: yup.string().required(errorMessage.requirePassword).min(6, errorMessage.minPassword)
})

const state = ref({
  username: undefined,
  password: undefined
})
const toast = useToast()
const onLogin = async (value) => {

  await auth.login(value.data)
  if (!auth.errorMessage) {
    await cart.getCarts()
    toast.add({ title: 'Đăng nhập thành công, bạn sẽ chuyển đến trang chủ', timeout: 1000 })
    setTimeout(() => {
      navigateTo("/")
    }, 1000);
  } else {
    toast.add({ title: auth.errorMessage, timeout: 3000, color: "red"})
    return 0
  }
}
const googleLogin = async (response) => {
  // decodeCredential will retrive the JWT payload from the credential
  console.log(response.credential);
  await auth.loginGoogle(response.credential)
  if (!auth.errorMessage) {
    toast.add({ title: 'Đăng nhập thành công, bạn sẽ chuyển đến trang chủ', timeout: 1000 })
    setTimeout(() => {
      navigateTo("/")
    }, 1000);
  } else {
    toast.add({ title: auth.errorMessage, timeout: 3000, color: "red"})
    return 0
  }
  
}
const googleLoginFail = ()=>{

}
</script>

<template>
  <MainLayout>
    <div class="flex justify-center items-center">
      <div class="my-10">
        <h3 class="my-5 text-center">Đăng nhập</h3>
        <div>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onLogin">
                <UFormGroup label="Tài khoản" name="username">
                    <UInput v-model="state.username" />
                </UFormGroup>
            <!-- <ErrorMessage name="username" class="text-red-500" /> -->
                <UFormGroup label="Mật khẩu" name="password">
                    <UInput v-model="state.password" type="password" />
                </UFormGroup>
            <!-- <ErrorMessage name="password" class="text-red-500" /> -->
            <!-- <span v-show="isError" class="text-red-500">{{ auth.errorMessage }}</span> -->
            <div class="flex items-center justify-between">
                <UButton type="submit">
                    Đăng nhập
                </UButton>
                <ULink
                to="/auth/forgotPassword"
                inactive-class="text-gray-500 hover:text-blue-500"
              >
                    Quên mật khẩu ?
                </ULink>
            </div>
            <div class="mt-4">
              <UDivider label="Hoặc đăng nhập với: " color="gray"  class="mb-4"/>
              <!-- google login -->
                <GoogleSignInButton
                  @success="googleLogin"
                  @error="googleLoginFail"
                ></GoogleSignInButton>

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

