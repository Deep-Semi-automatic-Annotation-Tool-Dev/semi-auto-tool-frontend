import { createApp } from 'vue'
import App from './App.vue'

import router from './plugins/routers'
import vuetify from './plugins/vuetify'

import VueRecyclerviewNew from 'vue-recyclerview'

createApp(App)
    .use(router)
    .use(vuetify)
    .use(VueRecyclerviewNew)
    .mount('#app')
