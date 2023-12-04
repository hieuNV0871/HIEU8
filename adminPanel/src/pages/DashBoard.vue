<template>
  <div>
    <ckeditor :editor="editor" v-model="editorData" @ready="ready" />
  </div>
</template>

<script setup>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { inject, ref, watchEffect } from "vue";

const user = inject('user')
const editor = ref(ClassicEditor);
const editorData = ref("<p>Hello CKEditor!</p>");

const ready = (e)=>{
    console.log(e)
}

watchEffect(()=>{
    console.log(editorData.value)
})
</script>
