import { authStore } from "../stores/auth"
export default defineNuxtRouteMiddleware((to, from) => {
    const auth = authStore()
    if (!auth.userq.username) {
        return navigateTo('/auth/login')
    }
    navigateTo(to.fullPath)  
  }
  )