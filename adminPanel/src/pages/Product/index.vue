<template>
  <div>
    <a-button type="primary" @click="addProduct">add</a-button>
    <Product :data="products" />
  </div>
</template>

<script setup>
import Product from "../../components/product/index.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const addProduct = () => {
  router.push("/add-product");
};

</script>
