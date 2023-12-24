<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
  </div>
</template>

<script setup>
  import { authStore } from './stores/auth';
  import { cartStore } from './stores/cart';

  const auth = authStore()
  const cart = cartStore()

  // auth.getUserInfo()

  const initData = async ()=> {
    await auth.getUserInfo()
    // await cart.getCarts()
  }
  initData()
</script>

