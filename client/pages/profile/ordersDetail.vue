<template>
    <UserLayout>
        <UContainer>
            hello
        </UContainer>
    </UserLayout>
</template>

<script setup>
import UserLayout from '~/layouts/UserLayout.vue';

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
    title: 'NVH - Chi tiet don hang',
  };
});
</script>
