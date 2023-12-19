<template>
    <div>
        <div class="w-[200px]">
                <UAccordion v-if="items.length" :items="items" color="black" variant="soft">
                    <template #item="{ item }">
                      <ULink
                        :to="item.toTrigger"
                        active-class="text-primary"
                        inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                        xem tất cả
                        <!-- {{ subCategory.name }} -->
                        </ULink>
                    <div v-for="(subCategory, index) in item.children" :key="index">
                        <ULink
                        :to="subCategory.to"
                        active-class="text-primary"
                        inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                        {{ subCategory.name }}
                        </ULink>
                    </div>
                    </template>
                </UAccordion>
                <UDivider class="my-8"/>
                <div>
                    <h3 class="text-sm font-light mb-2">Hãy để chúng tôi giúp bạn lựa chọn dễ dàng hơn với:</h3>
                    <div>
                        <URadioGroup @change="applyFilters" v-model="selected.price" legend="Mức giá mong muốn:" :options="priceOptions"  class="mb-5"/>
                        <URadioGroup @change="applyFilters" v-model="selected.brand" legend="Chọn thương hiệu:" :options="brandOptions" />
                    </div>
                    <!-- {{ selected }} -->
                    <div>
                        <UButton class="mt-10" @click="clearFilters">Xoá bộ lọc</UButton>
                    </div>
                </div>
            </div>
    </div>
</template>

<script setup>
import request from '~/utils/request';
import { ref } from 'vue'
const route = useRoute()
const items = ref([])




const priceOptions = ref([{
  value: {
    start: 0, end: 100000
  },
  label: 'Dưới 100k'
}, {
    value: {
    start: 100000, end: 300000
  },
  label: 'Từ 100k đến 300k'
}, {
    value: {
    start: 300000, end: 100000000000
  },
  label: 'Trên 300k'
}])
const brandOptions = ref([])

const selected = ref({
    price: null,
    brand: null
})

const applyFilters = () => {
  emit('apply-filters', selected);
};
const clearFilters = () => {
  selected.value = { price: null, brand: null };
  emit('clear-filters');
};

const emit = defineEmits(['apply-filters', 'clear-filters']);


const getParentCategory = async () => {
  
    try {
    const res = await request.get(`category/get_all_parent`);
    const parentCategories = res.data.data;
    const mappedCategories = parentCategories.map(category => ({
      label: category.name,
      toTrigger: "/collections/" + category._id,
      icon: '',
      defaultOpen: false,
      children: category.children.map(child => ({
        name: child.name,
        to: "/collections/" + child._id,
      })),
    }));

    // Update the items array
    items.value = mappedCategories;
  } catch (error) {
    console.error(error);
  }
  };   
const getAllBrand = async()=>{
    const res = await request.get("brand/get_all")
    const brands = res.data.data
    const mappedBrands = brands.map(brand=>({
        label: brand.name,
        value: brand.name
    }))
    brandOptions.value = mappedBrands

}
// const resetFilters = () => {
//   selected.value = { price: null, brand: null };
// };
onMounted(() => {
  getAllBrand()
  getParentCategory();

})
</script>

