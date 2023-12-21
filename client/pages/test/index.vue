<template>
  <div class="mt-48">
    <div class="flex">
    <div class="square-container">
      <div class="square bg-blue-500 rotate-45"></div>
    </div>
    <div class="square-container">
      <div class="square bg-green-500 rotate-315"></div>
    </div>
  </div>
  </div>
</template>

<script setup>


</script>

<style>
.container {
      position: relative;
      width: 200px;
      height: 200px;
    }

    .rectangle {
      width: 100%;
      height: 100%;
      position: absolute;
    }

    .rectangle-1 {
      background-color: #3490dc;
      transform: rotate(45deg);
      z-index: 1;
    }

    .rectangle-2 {
      background-color: #38a169;
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      z-index: 2;
    }
</style>