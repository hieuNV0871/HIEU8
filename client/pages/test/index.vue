<template>
    <div>
        <button @click="getRandomTitle">+++</button>
        {{ title }}
    </div>
</template>

<script setup>
const getRandomTitle = () => {
  
  const title = Math.floor(Math.random() * 10) + 1 < 5
    ? "Có khách đặt hàng, xem ngay"
    : "Đơn hàng mới đã được tạo, hãy kiểm tra ngay";

  return title;
};

const title = ref(getRandomTitle())
// console.log(title.value);

</script>

<style>

</style>