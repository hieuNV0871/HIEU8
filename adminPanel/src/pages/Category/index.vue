<template>
  <div class="flex space-x-10">
    <div class="flex-1 border-[red] border-r-2">
      <h3 class="text-center">Category</h3>
      <CategoryParent />
    </div>
  </div>
</template>

<script setup>
import CategoryParent from "../../components/category/index.vue";
</script>
