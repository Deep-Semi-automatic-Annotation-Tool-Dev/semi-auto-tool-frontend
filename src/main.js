import { createApp } from 'vue'
import App from './App.vue'

import router from '@/plugins/routers'
import vuetify from '@/plugins/vuetify'
import pinia from "@/plugins/pinia";

import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'

const app = createApp(App)
app.config.globalProperties.$baseURL = "https://autotag.hrabit64.xyz/";

app.config.globalProperties.DIALOG_CLICK_YES = 1;
app.config.globalProperties.DIALOG_CLICK_NO = 0;

app.config.globalProperties.DIALOG_TYPE_SUBTITLE = 100;
app.config.globalProperties.DIALOG_TYPE_TEXTFIELD = 110;
app.config.globalProperties.DIALOG_TYPE_COLORPICKER = 120;
app.config.globalProperties.DIALOG_TYPE_PROGRESS_LINEAR_INFINITY = 130;

app.config.globalProperties.CONTEXTMENU_PROJECT_RENAME = 200;
app.config.globalProperties.CONTEXTMENU_PROJECT_DELETE = 210;

app.config.globalProperties.CONTEXTMENU_TAG_RENAME = 300;
app.config.globalProperties.CONTEXTMENU_TAG_DELETE = 310;
app.config.globalProperties.CONTEXTMENU_TAG_COLOR = 320;

app.use(router)
    .use(vuetify)
    .use(pinia)
    .use(ContextMenu)
    // .component("vue-select", vSelect)
    .mount('#app')
