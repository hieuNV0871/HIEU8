
<template>
    <div>
        <div
          ref="topNavRef"
          class="flex justify-between items-center py-2 px-5 border-b border-b-gray-300 bg-dark-bg"
        >
          <div class="flex gap-x-1 items-center justify-center">
            <ULink
                class="flex justify-center items-center"
                to="/aaaa"
                active-class="text-primary"
                inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
              <UIcon name="i-heroicons-light-bulb" />
              </ULink>
              <ULink
                class="flex justify-center items-center"
                to="/aaaa"
                active-class="text-primary"
                inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
              <UIcon name="i-heroicons-light-bulb" />
              </ULink>
          </div>
          <div class="px-1">
            <span>
              hotline:
              <a class="hover:text-primary" href="tel:+84911015591">0911015591</a>
            </span>
          </div>
        </div>
        <div 
            ref="mainNavRef"
        class = "flex items-center justify-between py-2 px-28 transition-all duration-500 ease-linear">
            <div>
                <ULink
                    to="/"
                    class="text-primary font-extrabold"
                >
                    NVH-SHOP
                </ULink>
            </div>
            <nav>
                <ul class="flex items-center">
                    <li v-for="link in navLinks" :key="link.path">
                        <ULink
                        class="px-3 py-1"
                        :to="link.path"
                        active-class="text-primary"
                        :inactive-class="!isScroll ? 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200' : 'text-white hover:text-gray-300'"
                        >
                        {{ link.name }}
                    </ULink>
                </li>
            </ul>
        </nav>
        
        <div class="flex gap-x-4 items-center">
                <PreviewSearch/>
            
            <div v-if="cartItems.length <= 0">
              <UPopover mode="hover">
                <UChip  text="0" size="2xl">
                    <UButton icon="i-heroicons-shopping-cart" color="gray" />
                </UChip>
                <template #panel>
                  <div class="p-4">
                    <div>
                        <div>
                        </div>
                        <div>
                          <UButton to="/collections/all" color="black" variant="link">
                            Mua sắm ngay
                          </UButton>
                        </div>
                    </div>
                  </div>
                </template>
              </UPopover>
            </div>
            <div v-else>
              <UPopover mode="hover">
                <UChip  :text="cart.carts.cartItems.length " size="2xl">
                    <UButton icon="i-heroicons-shopping-cart" color="gray" />
                </UChip>
                <template #panel>
                  <div class="p-4">
                    <div v-if="cart.carts.cartItems.length">
                      <div>
                        <div v-for="cartItem in cart.carts.cartItems" :key="cartItem._id">
                          <ULink  to="/cart">
                              <div class="text-gray-500 hover:bg-gray-100  rounded-lg flex gap-x-2 items-center">
                                  <img :src="cartItem.variant.productId.images[0].src" alt="" class="w-[40px] h-[40px]"/>
                                  <div class="w-full">
                                      <h3 class="text-black">{{cartItem.variant.productId.name}}</h3>
                                      <div class="flex justify-between gap-x-2">
                                        <span class="w-[45%]">{{Number(cartItem.variant.productId.price).toLocaleString()  }} đ</span>
                                        <span >|</span>
                                        <span class="w-[45%]">
                                           {{ cartItem.variant.sku }}
                                        </span>
                                      </div>
                                  </div>
                              </div>
                          </ULink>
                        </div>
                      </div>
                      <div>
                        <UButton to="/cart" color="black" variant="link">
                          Xem giỏ hàng
                        </UButton>
                      </div>
                    </div>
                    <div v-else>
                        <div>
                        </div>
                        <div>
                          <UButton to="/collections/all" color="black" variant="link">
                            Mua sắm ngay
                          </UButton>
                        </div>
                    </div>
                  </div>
                </template>
              </UPopover>
            </div>

            <div v-if="!auth?.userq?.username">

                <UButton
                    to="/auth/login"
                    icon="i-heroicons-user-circle-solid"
                    size="sm"
                    color="primary"
                    variant="outline"
                    label="Đăng nhập"
                    :trailing="false"
                    />
            </div>
            <div class="flex" v-else>
              <UDropdown :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }" :popper="{ placement: 'bottom-start' }">
                <UAvatar
                  :src="auth.userq.avatar.src"
                  alt="Avatar"
                />
                <template #item="{ item }">
                  <ULink
                    :to="item.to"
                    class="text-gray-700"
                    @click="()=>handleClick(item.action)"
                >
                   {{ item.label }}
                </ULink>
                  <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
                </template>
                </UDropdown>
            </div>

        </div>
        </div>
    </div>
</template>

<script setup>

import { ref, onUnmounted } from 'vue';
import { authStore } from '~/stores/auth';
import { cartStore } from '~/stores/cart';



const auth = authStore();
const cart = cartStore()

const navLinks = ref([
  { name: 'Trang chủ', path: '/' },
  { name: 'Sản phẩm', path: '/collections/all' },
  { name: 'Phụ kiện', path: '/ok1' },
  { name: 'Tin tức', path: '/ok2' },

]);
const items = ref([
  [{
    label: 'Tài khoản',
    icon: 'i-heroicons-user',
    to: '/profile'
  }], [{
    label: 'Đăng xuất',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    action: 'logout'
  }]
])
const cartCount = ref(0)
const topNavRef = ref(null);
const mainNavRef = ref(null);
const isScroll = ref(false)
const handleScroll = () => {
  if (window.scrollY >= topNavRef.value.offsetHeight) {
    mainNavRef.value.classList.add("scrollEffect");
    mainNavRef.value.classList.remove("px-28");
    isScroll.value = true

  } else {
    mainNavRef.value.classList.remove("scrollEffect");
    mainNavRef.value.classList.add("px-28");
    isScroll.value = false

  }
  if (window.scrollY >= 500) {
    // isShowCartList.value = false;
  }
};
if(process.client){
    window.addEventListener("scroll", handleScroll);
}

const handleClick = label => {
  if(label === "logout") {
    logout()
  }
}
const cartItems = computed(() => {
  // Check if the cart data exists
  if (cart.carts && cart.carts.cartItems) {
    return cart.carts.cartItems;
  } else {
    return [];
  }
});
const logout = async ()=> {
  await auth.logout()
  cart.carts = {}
  auth.authUser = {}
  navigateTo("/auth/login")
}

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
<style>

.scrollEffect {
  padding-left: 5rem;
  padding-right: 5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-color: #000; /* Mã màu tương ứng với dark-bg trong hệ thống màu của bạn */
  position: fixed;
  z-index: 9;
  top: 0;
  left: 0;
  right: 0;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-color: #ccc;
        }
</style>