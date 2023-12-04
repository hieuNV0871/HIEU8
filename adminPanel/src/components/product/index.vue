<template>
  <div>
    <div class="flex space-x-2 justify-end my-5">
      <a-input class="w-[300px]" placeholder="search ..." v-model:value="search" size="large"/>
      <a-button size="large" type="primary" @click="searchProduct">search</a-button>
    </div>
    <a-table :dataSource="products" :columns="columns" :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'image'">
          <div class="max-w-[300px]">
            <a-carousel autoplay>
              <div v-for="img in record.images" :key="img.id">
                <a-image :src="img.src" class="max-w-[300px] min-w-[300px] max-h-[200px] min-h-[200px]" />
              </div>
            </a-carousel>
          </div>
        </template>
        <template v-if="column.key === 'description'">
          <div class="text-truncate" v-html="record.description"></div>
        </template>
        <template v-if="column.key === 'action'">
          <div class="flex items-center space-x-2">
            <a-button type="primary" @click="redirectUpdate(record.productId)">update</a-button>
            <a-button danger @click="deleteModal(record.productId)">delete</a-button>
          </div>
        </template>
      </template>
    </a-table>
    <div class="mt-10 text-center">
      <a-pagination
        v-model:current="pagination.page"
        :pageSize="pagination.limit"
        :total="pagination.total"
        show-less-items
      />
    </div>
    <a-modal
      v-model:open="openDelete"
      title="Are you sure you want to Delete?"
      :footer="false"
      centered
    >
      <div class="text-center py-10">
        <span
          class="border-[red] text-[red] border-solid border-[1px] rounded-[20px] px-5 py-2 cursor-pointer"
          @click="actionDelete"
          >Delete Product</span
        >
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import {deleteProduct, getAllProduct} from '../../request/product.api'
import { inject, onMounted, ref, watch } from "vue";

const startLoading = inject("startLoading");
const stopLoading = inject("stopLoading");
const router = useRouter()
const openDelete = ref(false);
const deleteId = ref('');
const products = ref([])
const search = ref('')
const pagination = ref({
  page: 1,
  limit: 5,
  total: 0,
});

const columns = [
  {
    title: "Image",
    dataIndex: "name",
    key: "image",
  },
  {
    title: "Product Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Brand",
    dataIndex: "brand",
    key: "brand",
  },
  {
    title: "Collection",
    dataIndex: "collectionId",
    key: "collectionId",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
  },
];

const redirectUpdate = (id)=>{
  router.push(`/update-product/${id}`)
}

const deleteModal = (id)=>{
  openDelete.value = true
  deleteId.value = id
}
const actionDelete = async ()=>{
  try {
    await deleteProduct(deleteId.value)
    openDelete.value = false
    getProduct()
  } catch (error) {
    console.log(error)
  }
}
const searchProduct = ()=>{
  pagination.value = {
    ...pagination.value,
    page: 1
  }
  getProduct()
}
const getProduct = async () =>{
  startLoading()
  try {
    const {data} = await getAllProduct({
      limit: pagination.value.limit,
      page: pagination.value.page,
      keyword: search.value
    })
    products.value = data.data
    pagination.value = {
      ...pagination.value,
      total: data.total,
    };
  } catch (error) {
    console.log(error)
  } finally {
    stopLoading()
  }
}
watch(
  () => pagination.value.page,
  () => {
    getProduct();
  }
);

onMounted(()=>{
  getProduct()
})
</script>

<style scoped>
.text-truncate {
  	display: -webkit-box;
  	-webkit-line-clamp: 3;  /* số dòng hiển thị */
  	-webkit-box-orient: vertical;
  	overflow: hidden;
  	text-overflow: ellipsis;
}
</style>