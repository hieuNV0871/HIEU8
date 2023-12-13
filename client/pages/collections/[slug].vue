<template>
    <ProductLayout>
      <UContainer>
        <div class="flex">
          <ProductSideBar :selected="selected" @clear-filters="handleClearFilters" @apply-filters="handleApplyFilters"></ProductSideBar>
          <div class="flex-1">
            <h3 class="mb-10 pl-5"> 
                <ULink active-class="text-primary"
                                inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" to="/collections">Sản phẩm</ULink> -> {{categoryName}}</h3>
            <div class="grid grid-cols-4 gap-4 px-3" v-if="filteredProducts.length">
                <UCard v-for="item in filteredProducts" :key="item._id" class="hover:shadow-2xl">
                <div class="py-0">
                  <div>
                    <ULink :to="`/product/${item._id}`">
                      <img class="" :src="item.images[0].src" alt="">
                    </ULink>
                  </div>
                  <UDivider label="hieunv"/>
                  <div class="text-center">
                      <!-- <h2>{{ item.productId }}</h2> -->
                      <h2 class="font-semibold text-xl">{{ item.name }}</h2>
                      <span class="text-slate-400">{{ item.price.toLocaleString() }} đ</span>
                      <!-- <span class="text-slate-400">{{ item.brand }} đ</span> -->

                  </div>
                </div>
                <!-- <template #footer>
                  <div class="flex gap-x-3 justify-center">
                    <UButton class="w-[100px] flex justify-center" truncate color="black" variant="solid" label="Mua ngay"></UButton>
                    <UTooltip text="Thêm vào giỏ hàng" :popper="{ arrow: true }">
                      <UButton class="w-[100px]" truncate color="black" variant="solid" label="Thêm vào giỏ hàng"></UButton>
                    </UTooltip>
                  </div>
                </template> -->
              </UCard>
            </div>
            <div v-else>
                khong co
            </div>
            <UPagination  class="m-10" size="sm" v-model="page" :page-count="pageCount" :total="totalPage" show-last show-first />
          </div>
        </div>
      </UContainer>
    </ProductLayout>
</template>

<script setup>
import ProductLayout from '../layouts/ProductLayout.vue';
import request from '../../utils/request'
useHead(() => {
return {
title: 'NVH - Sản phẩm',
}
})

const route = useRoute()
const {slug} = route.params
const categoryName = ref("")
const selected = ref({
price: null,
brand: null,
});

const handleApplyFilters = (appliedFilters) => {
selected.value = appliedFilters.value;
};
const handleClearFilters =()=>{
selected.value = {price: null, brand: null}
}

const page = ref(1)
const pageCount = ref(8)
const products = ref([

])


const totalPage = ref(1)

  const getAllProduct = async (pa, paCo)=>{
  const res = await request.get(`product/getProductByCategory/${slug}?page=${pa}&limit=${paCo}`)
  products.value = res.data.data
  }
const getTotalPage = async() => {
// Kiểm tra xem có bộ lọc được áp dụng hay không
if (selected.value.price === null && selected.value.brand === null) {
// Nếu không có bộ lọc, totalPage sẽ là độ dài của toàn bộ danh sách sản phẩm
const res = await request.get(`product/getProductByCategory/${slug}`)
totalPage.value = res.data.data.length
} else {
// Nếu có bộ lọc, totalPage sẽ là độ dài của danh sách sản phẩm đã được lọc
totalPage.value = filteredProducts.value.length;
}
};

const filteredProducts = computed(() => {
// Kiểm tra nếu selected.price và selected.brand đều là null
if (selected.value.price === null && selected.value.brand === null) {
// Trả về toàn bộ danh sách sản phẩm
return products.value;
}

// Lọc sản phẩm dựa trên điều kiện từ selected
return products.value.filter(item => {
const priceCondition =
  !selected.value.price ||
  (item.price >= selected.value.price.start &&
    item.price <= selected.value.price.end);

const brandCondition =
  !selected.value.brand || item.brand.name === selected.value.brand;

// Trả về true nếu sản phẩm thoả mãn cả hai điều kiện
return priceCondition && brandCondition;
});
});

const getCategory = async()=>{
    const res = await request.get(`category/get_category_by_id/${slug}`)
    categoryName.value =res.data.data.name
}
const getAll = async ()=>{
  const res = await request.get('product/getAllProduct')
  totalPage.value = res.data.data.length
}

watch(() => {
// getTotalPage()
getCategory()
getAllProduct(page.value, pageCount.value);
});
getAll()

</script>

