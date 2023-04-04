import { createApp } from 'vue'
import App from './App.vue'

import router from '@/plugins/routers'
import vuetify from '@/plugins/vuetify'
import pinia from "@/plugins/pinia";

const app = createApp(App)
app.config.globalProperties.$baseURL = "https://autotag.hrabit64.xyz/";

app.use(router)
    .use(vuetify)
    .use(pinia)
    .mount('#app')
