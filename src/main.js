import { createApp } from 'vue'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import App from './App.vue'
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8088'
axios.defaults.timeout = 1000

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
