<template>
    <div class="relative top-[13px]">
        <UInput
          color="white"
          variant="outline"
          placeholder="Search..."
          v-model="searchKeyWord"
          @click="handleInputFocus"
        />
      <UPopover :popper="{ arrow: true, offsetDistance: 0}">
        <h3 ref="openPopoverRef" class="hidden"></h3>
        <template #panel="{ close }">
          <div v-if="searchResults.length > 0" class="px-2 py-3 w-[300px]">
                <div v-for="searchResult in searchResults.slice(0, 5)" :key="searchResult">
                    <ULink  :to="`/product/${searchResult._id}`">
                        <div class="text-gray-500 hover:bg-gray-100 px-3 rounded-lg flex gap-x-2 items-center">
                            <img :src="searchResult.images[0].src" class="w-8 h-8"/>
                            <div class="">
                                <h3 class="text-black">{{searchResult.name}}</h3>
                                <span>{{Number(searchResult.price).toLocaleString()  }} đ</span>
                            </div>
                        </div>
                    </ULink>
                    
                </div>
                <div class="flex flex-col justify-center">
                    <h3 class="text-center">có <span class="font-semibold">{{ searchResults.length }}</span>  kết quả cho <span class="font-semibold">"{{ searchKeyWord }}"</span></h3>
                    <ULink
                      class="hover:underline"
                    >
                        xem tat ca
                    </ULink>
                </div>

          </div>
          <div v-else-if="searchResults.length <= 0" class="px-2 py-3 w-[200px]">
            <h3 v-if="searchKeyWord" class="px-3">Không tìm thấy kết quả cho "<span class="font-semibold">{{ searchKeyWord }}</span>"</h3>
            <h3 v-else class="px-3">Nhập từ khóa để tìm kiếm</h3>
            </div>
        </template>
      </UPopover>
    </div>
  </template>
  <script setup>
import request from "../utils/request";
  const searchKeyWord = useDebouncedRef('', 500);
  const openPopoverRef = ref(null)
  const searchResults = ref([])
  const handleInputFocus = () => {
        openPopoverRef.value.click()
  };

  const fetchSearchResult = async () => {
  if (searchKeyWord.value === "") {
    searchResults.value = [];
  } else {
    const res = await request.get(
      `product/search?keyword=${searchKeyWord.value}`
    );
    searchResults.value = res.data.data;
  }
};
watch(searchKeyWord, (newValue, oldValue) => {
  if (newValue.startsWith(" ")) {
    searchKeyWord.value = "";
  } else {
    fetchSearchResult();
  }
});

  </script>