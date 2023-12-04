import { createApp } from "vue";
import './index.css'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';import 'ant-design-vue/dist/reset.css';
import App from './App.vue'
import router from "./router";
import CKEditor from '@ckeditor/ckeditor5-vue';
import { createPinia } from "pinia";
const pinia = createPinia();
{/* <><script src="../node_modules/@ckeditor/ckeditor5-build-classic/build/ckeditor.js"></script><script src="../node_modules/@ckeditor/ckeditor5-vue/dist/ckeditor.js"></script></> */}


const app = createApp(App)
app.use(Antd)
app.use(router)
app.use(CKEditor)
app.use(pinia)
app.mount('#app')
