import { createApp } from 'vue'
import App from './App.vue'

import router from '@/plugins/routers'
import vuetify from '@/plugins/vuetify'
import pinia from "@/plugins/pinia";

createApp(App)
    .use(router)
    .use(vuetify)
    .use(pinia)
    .mount('#app')
