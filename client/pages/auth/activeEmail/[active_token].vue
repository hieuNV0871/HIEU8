<script setup>

import MainLayout from "~/layouts/MainLayout.vue";
const route = useRoute()
import { authStore } from '~/stores/auth';
const toast = useToast()

const activeEmail = async () => {
    const auth = authStore()
    const { active_token } = route.params
    await auth.activation(active_token)
    if (!auth.errorMessage) {
    toast.add({ title: 'Xác thực email thành công, bạn sẽ được chuyển đến trang đăng nhập', timeout: 1000 })
    setTimeout(() => {
      navigateTo("/auth/login")
    }, 2000);
  } else {
    toast.add({ title: auth.errorMessage, timeout: 3000, color: "red"})
    return 0
  }
}
activeEmail()

</script>
<template>
    <MainLayout>
        <div>
            <!-- activated -->
            activating
        </div>
    </MainLayout>
</template>