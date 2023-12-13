<template>
    <div>
        <Header/>
            <UContainer>
                <div class="flex mt-5 mb-20">
                    <div class="w-1/5">
                        <div class="flex flex-col gap-y-5 px-10 mt-10 mb-20">
                            <ULink
                                    to="/profile"
                                    class="p-2 bg-slate-300 rounded-3xl text-center"
                                    active-class="text-primary"
                                    inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                    >
                                    Thong tin ca nhan
                            </ULink>
                            <ULink
                                    to="/profile/orders-detail"
                                    class="p-2 bg-slate-300 rounded-3xl text-center"
                                    active-class="text-primary"
                                    inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                    >
                                    Chi tiet don hang
                            </ULink>
                        </div>
                    </div>
                    <div class="w-4/5">
                        <slot/>

                    </div>
                </div>
            </UContainer>
        <Footer/>
    </div>
</template>

<script setup>





</script>
