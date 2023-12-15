import { ref, computed } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import axios from "axios";
import request from "../utils/request";
export const authStore = defineStore("auth", () => {
  let authUser = useLocalStorage("pinia/auth/login", {});
  let isLogged = useLocalStorage("isLogged", false)
  let token = useLocalStorage("dung_dong_vao_cai_nay","")
  let timeExpried = useLocalStorage(0)
  let errorMessage = ref("");
  const userq = computed(() => authUser.value);
  async function getUserInfo(){
    const res = await request.get("user/info")
    authUser.value = res.data.data
  }
  async function login(user) {
    errorMessage.value = ""
    try {
      const res = await request.post(
        "auth/signin",
        user,
        {withCredentials: true}
      );
      isLogged.value = true
      authUser.value = res.data.user;
      // const rf = jwt_decode(res.data.refreshToken)
      // timeExpried.value = rf.exp *1000
    } catch (error) {
      errorMessage.value = error.response.data.msg;
    }
  }

  async function getToken(){
    errorMessage.value = ""

    try {
      const res = await request.post("auth/refresh_token", null, {
        withCredentials: true,
        
      })
      token.value = res.data.accessToken
    } catch (error) {
      errorMessage.value = error.response.data.msg;
    }
  }

  const loginGoogle = async (tokenId) => {
    errorMessage.value = ""

    try {
      const res = await request.post(
        "auth/google_login",
        { tokenId: tokenId },
        {withCredentials: true,}
      );
      authUser.value = res.data.userGG;
      console.log(res);
      isLogged.value = true
    } catch (error) {
      errorMessage.value = error.response.data.msg;
    }
  };

  const register = async (user) => {
    errorMessage.value = ""

    try {
      await request.post("auth/signup", user);
    } catch (error) {
      errorMessage.value = error.response.data.msg;
    }
  };

  const activation = async (activeToken) => {
    errorMessage.value = ""

    try {
      const res = await request.post("auth/activation", {
        activation_token: activeToken,
      });
      return res.data;
    } catch (error) {
      errorMessage.value = error.response.data.msg;
    }
  };

  const forgotPass = async (email) => {
    errorMessage.value = ""

    try {
      await request.post("auth/forgot_password", email);
    } catch (error) {
      errorMessage.value = error.response.data.msg;
    }
  };
  const resetPassword = async (password, reset_token) => {
    errorMessage.value = ""

    try {
      await request.post(
        "auth/reset_password",
        password,
        { headers: { Authorization: reset_token } }
      );
    } catch (error) {
      errorMessage.value = error.response.data.msg;
    }
  };

  const changePass = async (value) => {
    errorMessage.value = ""

    try {
      await request.patch("auth/change_pass", value )
    } catch (error) {
      errorMessage.value = error.response.data.msg;
    }
  }

  const logout = async () => {
    errorMessage.value = ""

    try {
      await request.post("auth/signout", null , {withCredentials: true});
      authUser.value = {};
      isLogged.value = false
      token.value = ''
    } catch (error) {
      errorMessage.value = error.response.data.msg
    }
  };

  return {
    authUser,
    userq,
    isLogged,
    token,
    errorMessage,
    timeExpried,
    getUserInfo,
    login,
    getToken,
    loginGoogle,
    register,
    activation,
    forgotPass,
    resetPassword,
    changePass,
    logout,
  };
});
