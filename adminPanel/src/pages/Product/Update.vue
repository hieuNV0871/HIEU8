<template>
  <div class="flex justify-center">
    <div class="max-w-[700px]">
      <a-form
        :model="formState"
        name="basic"
        hideRequiredMark
        layout="vertical"
        autocomplete="off"
        @finish="onFinish"
      >
        <a-form-item
          label="Name"
          name="name"
          :rules="[{ required: true, message: 'Please input your Name!' }]"
        >
          <a-input size="large" v-model:value="formState.name" />
        </a-form-item>
        <a-form-item
          label="Price"
          name="price"
          :rules="[{ required: true, message: 'Please input your Price!' }]"
        >
          <a-input-number size="large" :min="1" v-model:value="formState.price" />
        </a-form-item>

        <a-form-item name="category" label="Category">
          <a-select
            v-model:value="formState.category"
            size="large"
            placeholder="Select a category"
          >
            <a-select-opt-group v-for="e in category" :key="e.value">
              <template #label>
                <span>
                  {{ e.label }}
                </span>
              </template>
              <a-select-option
                v-for="c in e.children"
                :key="c.value"
                :value="c.value"
                >{{ c.label }}</a-select-option
              >
            </a-select-opt-group>
          </a-select>
        </a-form-item>

        <a-form-item name="brand" label="Brand">
          <a-select
            v-model:value="formState.brand"
            show-search
            size="large"
            placeholder="Select a Brand"
            :options="brand"
            :filter-option="filterOption"
          ></a-select>
        </a-form-item>

        <a-form-item name="collectionId" label="Collection">
          <a-select
            v-model:value="formState.collectionId"
            show-search
            size="large"
            placeholder="Select a Collection"
            :options="collection"
            :filter-option="filterOption"
          ></a-select>
        </a-form-item>

        <a-form-item name="images">
          <div class="flex space-x-2">
            <label for="image" v-if="formState.images.length < 5">
              <div
                class="w-[100px] h-[100px] rounded-[6px] border-dashed border-2 border-[#999] flex items-center justify-center"
              >
                <loading-outlined v-if="loading"></loading-outlined>
                <plus-outlined v-else></plus-outlined>
              </div>
            </label>
            <input type="file" hidden id="image" @input="upload" />
            <a-upload
              v-model:file-list="formState.images"
              list-type="picture-card"
              class="avatar-uploader"
              :maxCount="5"
            >
            </a-upload>
          </div>
        </a-form-item>

        <a-form-item label="Description" name="description">
          <ckeditor :editor="editor" v-model="formState.description" />
        </a-form-item>
        <div class="mb-[5px]">Variant</div>
        <div class="flex flex-col">
          <a-space
            v-for="(variant, index) in formState.variants"
            :key="variant.key"
          >
            <a-form-item
              :name="['variants', index, 'colorId']"
              :rules="{
                required: true,
                message: 'color can not be null',
                trigger: 'change',
              }"
            >
              <a-select
                v-model:value="variant.colorId"
                show-search
                size="large"
                class="min-w-[150px]"
                placeholder="Select a color"
                :options="color"
                :filter-option="filterOption"
              ></a-select>
            </a-form-item>
            <a-form-item
              :name="['variants', index, 'sizeId']"
              :rules="{
                required: true,
                message: 'size can not be null',
                trigger: 'change',
              }"
            >
              <a-select
                v-model:value="variant.sizeId"
                show-search
                size="large"
                class="min-w-[150px]"
                placeholder="Select a size"
                :options="size"
                :filter-option="filterOption"
              ></a-select>
            </a-form-item>
            <a-form-item
              :name="['variants', index, 'quantity']"
              :rules="{
                required: true,
                message: 'quantity can not be null',
                trigger: 'change',
              }"
            >
              <a-input-number
                v-model:value="variant.quantity"
                size="large"
                placeholder="quantity"
                :min="1"
              />
            </a-form-item>
            <MinusCircleOutlined
              v-if="index > 0"
              class="dynamic-delete-button"
              @click="removeVariant(variant.key)"
            />
          </a-space>
        </div>
        <a-form-item>
          <a-button size="large" @click="addVariant"> + variant </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">Update Product</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  PlusOutlined,
  LoadingOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons-vue";
import { uploadImage } from "../../request/upload.api.js";
import { getAll } from "../../request/brand";
import { getAllCategory } from "../../request/category.api";
import { getAllCollection } from "../../request/collection";
import { inject, onBeforeMount, onMounted, ref } from "vue";
import {
  createProduct,
  getAllColor,
  getAllSize,
  getProductById,
  updateProduct,
} from "../../request/product.api";
import { useRouter } from "vue-router";
const startLoading = inject("startLoading");
const stopLoading = inject("stopLoading");
const editor = ref(ClassicEditor);
const formState = ref({
  name: "",
  description: "",
  category: "",
  brand: "",
  collectionId: "",
  price: 1,
  images: [],
  variants: [
    {
      sizeId: null,
      colorId: null,
      quantity: 1,
      key: Date.now(),
    },
  ],
});
const loading = ref(false);
const brand = ref([]);
const category = ref([]);
const collection = ref([]);
const color = ref([]);
const size = ref([]);
const router = useRouter();
const { id } = router.currentRoute.value.params;
const onFinish = async (values) => {
  startLoading();
  const data = {
    ...values,
    images: values.images.map((img) => ({
      src: img.url,
      id: img.uid,
    })),
  };
  try {
    await updateProduct(id, data);
    router.push("/product");
  } catch (error) {
    console.log(error);
  } finally {
    stopLoading();
  }
};
const addVariant = () => {
  formState.value.variants.push({
    color: "",
    size: "",
    quantity: 0,
    key: Date.now(),
  });
};
const removeVariant = (key) => {
  formState.value.variants = formState.value.variants.filter(
    (e) => e.key !== key
  );
};
const filterOption = (input, option) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const upload = async (e) => {
  loading.value = true;
  const formData = new FormData();
  formData.append("image", e.target.files[0]);
  try {
    const { data } = await uploadImage(formData);
    const img_upload = {
      uid: data.data.id,
      url: data.data.src,
      status: "success",
      name: "",
    };
    formState.value = {
      ...formState.value,
      images: [...formState.value.images, img_upload],
    };
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const getAllCategoryData = async () => {
  try {
    const { data } = await getAllCategory();
    category.value = data.data.map((e) => ({
      label: e.name,
      value: e._id,
      children: e.children.map((c) => ({
        label: c.name,
        value: c._id,
      })),
    }));
  } catch (error) {
    console.log(error);
  }
};

const getAllCollectionData = async () => {
  try {
    const { data } = await getAllCollection();
    collection.value = data.data.map((e) => ({
      label: e.name,
      value: e._id,
    }));
  } catch (error) {
    console.log(error);
  }
};

const getAllBrand = async () => {
  try {
    const { data } = await getAll();
    brand.value = data.data.map((e) => ({
      label: e.name,
      value: e._id,
    }));
  } catch (error) {
    console.log(error);
  }
};

const getColor = async () => {
  try {
    const { data } = await getAllColor();
    color.value = data.data.map((e) => ({
      label: e.name,
      value: e._id,
    }));
  } catch (error) {
    console.log(error);
  }
};

const getSize = async () => {
  try {
    const { data } = await getAllSize();
    size.value = data.data.map((e) => ({
      label: e.name,
      value: e._id,
    }));
  } catch (error) {
    console.log(error);
  }
};

const getProductDetail = async () => {
  startLoading();
  try {
    const { data } = await getProductById(id);
    formState.value = {
      ...formState.value,
      name: data.data.product.name,
      description: data.data.product.description,
      category: data.data.product.category?._id,
      brand: data.data.product.brand?._id,
      collectionId: data.data.product.collectionId?._id,
      price: data.data.product.price,
      images: data.data.product.images.map((image, index) => ({
        uid: image.id,
        url: image.src,
        status: "success",
        name: "",
      })),
      variants: data.data.variants.map((variant, index) => ({
        sizeId: variant.sizeId?._id,
        colorId: variant.colorId?._id,
        key: variant?._id,
        quantity: variant?.quantity,
      })),
    };
  } catch (error) {
    console.log(error);
  } finally {
    stopLoading();
  }
};
onBeforeMount(() => {
  getAllBrand();
  getAllCategoryData();
  getAllCollectionData();
  getColor();
  getSize();
});
onMounted(() => {
  getProductDetail();
});
</script>
