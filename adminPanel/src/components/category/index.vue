<template>
  <div>
    <div class="text-left mb-5">
      <a-button type="primary" @click="showModal">Add</a-button>
    </div>
    <div class="flex justify-center">
      <div class="w-[1000px] border-solid border-[#dadada]">
        <div class="flex items-center bg-[#dadada] py-5">
          <div class="text-center w-[30%] font-bold">Parent</div>
          <div class="text-center flex-1 font-bold">Children</div>
        </div>
        <div
          class="flex items-center py-2 border-t"
          v-for="e in dataSource"
          :key="e._id"
        >
          <div class="text-center w-[30%] cursor-pointer relative">
            <div
              class="absolute right-0 top-0 bottom-0 w-[1px] bg-[#dadada]"
              v-if="!e.childrenData.length"
            ></div>
            <InfoCategory
              :refresh="getAllDataCategory"
              :info="e"
              :openUpdate="openUpdate"
            />
          </div>
          <div
            class="text-center flex-1 border-l max-h-[200px] overflow-y-auto"
          >
            <div
              class="py-2 cursor-pointer"
              v-for="child in e.childrenData ?? []"
              :key="child._id"
            >
              <InfoCategory
                type="children"
                :refresh="getAllDataCategory"
                :info="child"
                :openUpdate="openUpdate"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-10 text-center">
      <a-pagination
        v-model:current="pagination.page"
        :pageSize="pagination.limit"
        :total="pagination.total"
        show-less-items
      />
    </div>

    <a-modal
      v-model:open="open"
      :title="`${updateCate.status ? 'update' : 'create'} Category`"
      :footer="false"
    >
      <a-form
        :model="formState"
        hideRequiredMark
        layout="vertical"
        autocomplete="off"
        @finish="onFinish"
      >
        <a-form-item
          name="name"
          label="Name"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input v-model:value="formState.name" size="large" />
        </a-form-item>
        <a-form-item
          label="Position"
          name="position"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input-number size="large" v-model:value="formState.position" />
        </a-form-item>
        <a-form-item
          name="parentCategory"
          label="Category Parent"
          v-if="!(formState.childrenData && formState.childrenData.length)"
        >
          <a-select
            v-model:value="formState.parentCategory"
            show-search
            placeholder="Select a category parent"
            style="width: 200px"
            :options="options"
            :filter-option="filterOption"
            size="large"
          ></a-select>
        </a-form-item>
        <div class="text-center">
          <a-button type="primary" size="large" class="!px-10" htmlType="submit"
            >Submit</a-button
          >
        </div>
      </a-form>
    </a-modal>
  </div>
</template>
<script setup>
import { inject, onMounted, ref, watch } from "vue";
import {
  createCategory,
  getAllCategory,
  updateCategory,
} from "../../request/category.api";
import InfoCategory from "./InfoCategory.vue";

const pagination = ref({
  page: 1,
  limit: 5,
  total: 0,
});
const startLoading = inject("startLoading");
const stopLoading = inject("stopLoading");
const open = ref(false);
const updateCate = ref({
  status: false,
  key: "",
});
const formState = ref({
  name: "",
  position: null,
  parentCategory: null,
});
const dataSource = ref([]);
const options = ref([]);

const showModal = () => {
  updateCate.value = {
    status: false,
  };
  formState.value = {
    name: "",
    position: null,
    parentCategory: null,
  };
  open.value = true;
};

const onFinish = async (values) => {
  startLoading();
  try {
    if (updateCate.value.status) {
      await updateCategory(updateCate.value.key, values);
    } else {
      await createCategory(values);
    }
    getAllDataCategory();
    open.value = false;
  } catch (error) {
    console.log(error);
  } finally {
    stopLoading();
  }
};

const openUpdate = (info, type) => {
  updateCate.value = {
    status: true,
    key: info._id ?? info.key,
  };
  open.value = true;
  formState.value = {
    ...info,
    parentCategory: type === "children" ? getParenId(info._id) : null,
  };
  console.log(formState.value);
};

const getParenId = (idChildrent) => {
  let key = null;
  dataSource.value.forEach((element) => {
    if (element.childrenData.find((child) => child._id === idChildrent)) {
      key = element.key;
    }
  });
  return key;
};

const filterOption = (input, option) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const getAllDataCategory = async () => {
  startLoading();
  try {
    const { data } = await getAllCategory({
      limit: pagination.value.limit,
      page: pagination.value.page,
    });
    options.value = data.data.map((e) => ({
      label: e.name,
      value: e._id,
    }));
    dataSource.value = data.data.map((e) => ({
      key: e._id,
      name: e.name,
      position: e.position,
      childrenData: e.children,
    }));
    console.log(data.total);
    pagination.value = {
      ...pagination.value,
      total: data.total,
    };
  } catch (error) {
    console.log(error);
  } finally {
    stopLoading();
  }
};

watch(
  () => pagination.value.page,
  () => {
    getAllDataCategory();
  }
);

onMounted(() => {
  getAllDataCategory();
});
</script>

<style scoped>
.border-t {
  border-top: 1px solid #dadada;
}

.border-l {
  border-left: 1px solid #dadada;
}
</style>
