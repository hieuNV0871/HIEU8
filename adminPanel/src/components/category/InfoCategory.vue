<template>
  <div>
    <div class="flex items-center justify-center" v-if="type === 'parent'">
      <a-tag
        color="purple"
        class="px-5 py-2 text-[16px] font-semibold"
        @click="openUpdate(info, 'parent')"
        >{{ info.name }}
      </a-tag>
      <DeleteOutlined
        @click="deleteModal(info.key)"
        v-if="!(info.childrenData && info.childrenData.length)"
        class="text-[18px] text-[red]"
      />
    </div>
    <div v-else>
      <a-tag
        :bordered="false"
        color="blue"
        class="px-4 py-1 text-[14px]"
        @click="openUpdate(info, 'children')"
        >{{ info.name }}</a-tag
      >
      <DeleteOutlined @click="deleteModal(info._id)" class="text-[16px] text-[red]" />
    </div>
    <a-modal
      v-model:open="open"
      title="Are you sure you want to Delete?"
      :footer="false"
      centered
    >
      <div class="text-center py-10">
        <span
          class="border-[red] text-[red] border-solid border-[1px] rounded-[20px] px-5 py-2 cursor-pointer"
          @click="actionDelete"
          >Delete Category</span
        >
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { DeleteOutlined } from "@ant-design/icons-vue";
import { ref } from "vue";
import { deleteCategory } from "../../request/category.api";
const props = defineProps({
  type: {
    type: String,
    default: "parent",
  },
  info: {
    type: String,
  },
  openUpdate: {
    type: Function,
  },
  refresh: {
    type: Function
  }
});
const open = ref(false);
const deleteId = ref('')
const deleteModal = (id)=>{
  open.value = true
  deleteId.value = id
}
const actionDelete = async ()=>{
  try {
    await deleteCategory(deleteId.value)
    open.value = false
    props.refresh()
  } catch (error) {
    console.log(error)
  }
}
</script>
