<template>
  <a-layout class="min-h-[100vh]">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item :key="item.path" v-for="item in menu">
          <span>{{ item.name }}</span>
        </a-menu-item>
        
        <a-menu-item>
          <span @click="handleLogout">Dang xuat</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <div class="flex items-center justify-end px-8 relative">
          <h3 class="absolute left-[50%] translate-x-[-50%] font-bold">
            ADMIN
          </h3>
          <div class="mr-20 cursor-pointer">
            <a-popover v-model:open="visible" title="Thông báo mới" trigger="click">
              <template #content>
                <div>
                  <div v-for="item in notifications" :key="item._id" class="flex justify-between items-center gap-x-5">
                    <div>
                      <h3 class="font-semibold text-sm">{{ item.title }}</h3>
                      <h4 :title="item.content" class="font-light text-[12px] truncate overflow-ellipsis w-56">{{ item.content }}</h4>
                    </div>
                    <div>
                      <h5 @click="handleCheckNoti(item._id)">kiem tra ngay</h5>
                      <h5 ref="refIsRead" @click="handleReadNoti(item._id)">Đánh dấu đã đọc</h5>
                    </div>
                  </div>
                </div>
                <a @click="hide">Close</a>
              </template>
              <a-badge :count="notifications?.length || '0'">
                <a-avatar shape="square" size="small" />
              </a-badge>
            </a-popover>
          </div>
            <div class="flex items-center space-x-2 cursor-pointer">
              <a-avatar >{{ auth.authUser.avatar ? auth.authUser.avatar.src : "" }}</a-avatar> <span>{{auth.authUser.avatar ? auth.authUser.username : "username"}}</span>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff' }"
        class="max-h-[calc(100vh-120px)] overflow-auto"
      >
        <slot />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script setup>
import { ref, watch, watchEffect , onMounted} from "vue";
import { useRouter } from "vue-router";
import {authStore} from '../stores/auth'
const auth = authStore()
import {getAllNotifications, readNotification} from '../request/notification'
const notifications = ref()
const refIsRead = ref(null)
const router = useRouter();

import { io } from "socket.io-client";
const socket = io("http://localhost:5000");
const userId = auth.authUser._id
socket.on("connect", () => {
  console.log(socket.id); 
  socket.emit("userId", userId);
});

socket.on("sendNotiToAdmin", (msg) => { 
  if(msg==="new-order"){
    alert("co don hang moi")
    getAllNoti()
  }
 });
const handleReadNoti = async id => {
  await readNotification(id)
  getAllNoti()
}

const handleCheckNoti = async id => {
  await readNotification(id)
  router.push("/order")
  getAllNoti()
  visible.value = false
}
const getAllNoti = async ()=>{
  const {data} = await getAllNotifications({
      limit: 5,
      isRead: "false"
  })
  notifications.value = data.data
}
const selectedKeys = ref([]);
const collapsed = ref(false);
const menu = ref([])

const setMenu = ()=>{
  const menutmp = [
  {
    path: "/dashboard",
    name: "Dashboard",
  },
  {
    path: "/user",
    name: "User",
  },
  {
    path: "/category",
    name: "Category",
  },
  {
    path: "/product",
    name: "Product",
  },
  {
    path: "/news",
    name: "News",
  },
  {
    path: "/brand",
    name: "Brand",
  },
  {
    path: "/collection",
    name: "Collection",
  },
  {
    path: "/order",
    name: "Order",
  },
];
  if(auth.authUser.role === 9999){
    menu.value = menutmp
  }else if(auth.authUser.role===1){
    menu.value = [
  {
    path: "/dashboard",
    name: "Dashboard",
  },

  {
    path: "/category",
    name: "Category",
  },
  {
    path: "/product",
    name: "Product",
  },
  {
    path: "/news",
    name: "News",
  },
  {
    path: "/brand",
    name: "Brand",
  },
  {
    path: "/collection",
    name: "Collection",
  },
  {
    path: "/order",
    name: "Order",
  },
];
  }
}

const setKeyManu = () => {
  menu.value.forEach((item) => {
    if (router.currentRoute.value.fullPath.includes(item.path)) {
      selectedKeys.value = [item.path];
      return;
    }
  });
};
const handleLogout = async()=>{
  const check = confirm("dang xuat ?")
  if(check){
    await auth.logout()
    router.push("/login")
  }
}


const visible = ref(false);

const hide = () => {
  visible.value = false;
};
watchEffect(() => {
  setKeyManu();
});

watch(
  () => selectedKeys.value,
  (value) => {
    router.push(value[0]);
  }
);
onMounted(() => {
  setMenu()
  getAllNoti()
})
</script>
<style>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}
</style>
