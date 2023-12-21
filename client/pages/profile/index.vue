<template>
        <UserLayout>
          <div v-if="userInfo.username">
            <h3>xin chao: <span class="font-semibold">{{ userInfo.username }}</span></h3>
            <div class="flex gap-x-20">
              <form action="" enctype="multipart/form-data" @submit.prevent="handleChangeInfo">
                  <div class="flex flex-col gap-y-2">
                      <label for="">Avatar: </label>
                      <input class="hidden" ref="avatarInputRef" type="file" name="" id="" @change="handleFileUpload">
                      <div>
                        <UButton
                          @click.prevent="selectAvatarInputRef"
                            icon="i-heroicons-pencil-square"
                            size="sm"
                            color="primary"
                            variant="solid"
                            label="Chọn ảnh"
                            :trailing="false"
                          />
                      </div>
                      <div>
                          <img 
                              class="w-20 h-20 object-cover"
                              :src="avatar ? avatarBlob : userInfo.avatar.src"
                              alt=""
                          />
                      </div>
                      <div>
                        <UButton type="submit" variant="outline" class="mt-4">submit</UButton>
                      </div>
                  </div>
                </form>
                <div>
                  <span>DOI MAT KHAU</span>
                  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onChangePassword">
                    <UFormGroup label="Mật khẩu cũ" name="oldPassword">
                          <UInput v-model="state.oldPassword" type="password" />
                      </UFormGroup>
                      <UFormGroup label="Mật khẩu mới" name="password">
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
        </UserLayout>
</template>

<script setup>
import UserLayout from '~/layouts/UserLayout.vue';
import { authStore } from '~/stores/auth';
import request from "~/utils/request";
import * as yup from 'yup'
import { errorMessage } from "~/utils/validation";

definePageMeta({
  middleware: [
    function (to, from) {
      // Custom inline middleware
    },
    'auth',
  ],
});

useHead(() => {
  return {
    title: 'NVH - thông tin cá nhân',
  };
});
const toast = useToast()
const schema = yup.object({
  oldPassword: yup.string().required(errorMessage.requirePassword).min(6, errorMessage.minPassword),
    password: yup.string().required(errorMessage.requirePassword).min(6, errorMessage.minPassword),
    cfPassword: yup.string().required(errorMessage.requirePassword).min(6, errorMessage.minPassword).oneOf([yup.ref('password'), null], errorMessage.passwordMatch),
})

const state = ref({
cfPassword: undefined,
  password: undefined,
  oldPassword: undefined
})
const auth= authStore()
    const userInfo = ref({})
    const  avatar  = ref()
    const avatarBlob = ref()
    const avatarInputRef = ref(null)

    const onChangePassword = async (value) => {
      await auth.changePass(value.data)
  if (!auth.errorMessage) {
    toast.add({ title: 'Đổi mật khẩu thành công, bạn sẽ được chuyển đến trang đăng nhập', timeout: 1000 })
    await auth.logout()
    navigateTo("/auth/login")
  } else {
    toast.add({ title: auth.errorMessage, timeout: 3000, color: "red"})
    return 0
  }
}
    const selectAvatarInputRef = () => {
        avatarInputRef.value.click()
    }
    const handleFileUpload = (e) => {
        avatar.value = e.target.files[0]
        avatarBlob.value = URL.createObjectURL(e.target.files[0])
        
    }
    const getUserInfo = async()=>{
      userInfo.value = auth.authUser
    }

    const handleChangeInfo = async () => {
        if(avatar.value){
            const formData = new FormData()
            formData.append("folderName", 'avatar')
            formData.append("image", avatar.value)
            const res = await request.post("upload/upload_avatar", formData)
            const avatarCloudinary = res.data.data
            const value = {
                avatar: avatarCloudinary
            }
            console.log(value);
            await request.patch("user/update", value)
            await auth.getUserInfo()
            if(!auth.errorMessage){
    toast.add({ title: 'Cập nhật thông tin thành công', timeout: 1000 })

            }
        }
    }
    onMounted(() => {
      getUserInfo()
      
    }),
    onBeforeUnmount(() => {
        if (avatarBlob.value) {
            URL.revokeObjectURL(avatarBlob.value)
    }
})
</script>

