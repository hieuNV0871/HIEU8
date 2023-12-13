import { createRouter, createWebHistory } from "vue-router";

import About from "../pages/About.vue";
import Category from "../pages/Category/index.vue";
import DashBoard from "../pages/DashBoard.vue";
import Product from "../pages/Product/index.vue";
import AddProduct from "../pages/Product/Add.vue";

import UpdateProduct from "../pages/Product/Update.vue";
import Login from "../pages/Login.vue";
import News from '../pages/News.vue'
import Brand from '../pages/Brand.vue'
import Collection from '../pages/Collection.vue'
import Order from '../pages/Order.vue'
import AddOrders from "../pages/Add-orders.vue";

import User from '../pages/User.vue'
import { authStore } from "../stores/auth";

const routes = [
  { path: "/about", component: About, meta: {requireAuth: true, requiredAuthEmployee: true} },
  { path: "/dashboard", component: DashBoard ,meta: {requireAuth: true, requiredAuthEmployee: true}},
  { path: "/", component: DashBoard ,meta: {requireAuth: true, requiredAuthEmployee: true}},
  { path: "/category", component: Category,meta: {requireAuth: true, requiredAuthEmployee: true} },
  { path: "/add-product", component: AddProduct,meta: {requireAuth: true, requiredAuthEmployee: true} },
  { path: "/update-product/:id", component: UpdateProduct,meta: {requireAuth: true, requiredAuthEmployee: true} },
  {
    path: "/product",
    component: Product,meta: {requireAuth: true, requiredAuthEmployee: true}
  },
  { path: "/login", component: Login },
  { path: "/news", component: News,meta: {requireAuth: true, requiredAuthEmployee: true} },
  { path: "/brand", component: Brand,meta: {requireAuth: true, requiredAuthEmployee: true} },
  { path: "/collection", component: Collection,meta: {requireAuth: true, requiredAuthEmployee: true} },
  { path: "/order", component: Order,meta: {requireAuth: true, requiredAuthEmployee: true} },
  { path: "/add-orders", component: AddOrders,meta: {requireAuth: true, requiredAuthEmployee: true} },
  { path: "/user", component: User,meta: {requireAuth: true, requiredAuthAdmin: true} },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  if (!to.meta.requireAuth) {
    return next();
  }
  
  const auth = authStore();
  
  if (!auth.authUser.username) {
    return next("/login");
  }
  
  if (to.meta.requiredAuthEmployee && auth.authUser.role == 0) {
    return next("/login");
  }
  if (to.meta.requiredAuthAdmin && auth.authUser.role !== 9999) {
    return next("/login");
  }
  return next();
});
export default router
