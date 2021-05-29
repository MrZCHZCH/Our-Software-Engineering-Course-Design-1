import {createApp} from 'vue'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import App from './App.vue'
import axios from 'axios'
import {createRouter, createWebHashHistory} from 'vue-router'
import main from "@/view/main";
import {VueClipboard} from '@soerenmartius/vue3-clipboard'

const routes = [
    {path: '/', component: main}
]

const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    alert(error);
    return Promise.reject(error);
});

axios.defaults.baseURL = 'http://127.0.0.1:8088'
axios.defaults.timeout = 1000 * 10

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    alert(error);
    return Promise.reject(error);
});

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(VueClipboard)
app.mount('#app')
