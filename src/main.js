import { createApp } from 'vue'
import App from './App.vue'

import router from '@/plugins/routers'
import vuetify from '@/plugins/vuetify'
import pinia from "@/plugins/pinia";

import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'

import VueSSE from 'vue-sse'

const app = createApp(App)
// app.config.globalProperties.$baseURL = "https://autotag.hrabit64.xyz/";
// app.config.globalProperties.$mlURL = "https://autotag-ml.hrabit64.xyz/";
app.config.globalProperties.$baseURL = "http://api.auto-tag.xyz:30002/";
app.config.globalProperties.$mlURL = "http://ml-api.auto-tag.xyz:30002/";
app.config.globalProperties.$crudURL = "https://autotag-crdt.hrabit64.xyz/";

app.config.globalProperties.DIALOG_CLICK_YES = 1;
app.config.globalProperties.DIALOG_CLICK_NO = 0;

app.config.globalProperties.DIALOG_TYPE_SUBTITLE = 100;
app.config.globalProperties.DIALOG_TYPE_TEXTFIELD = 110;
app.config.globalProperties.DIALOG_TYPE_COLORPICKER = 120;
app.config.globalProperties.DIALOG_TYPE_PROGRESS_LINEAR_INFINITY = 130;
app.config.globalProperties.DIALOG_TYPE_PROGRESS_LINEAR = 140;

app.config.globalProperties.CONTEXTMENU_PROJECT_RENAME = 200;
app.config.globalProperties.CONTEXTMENU_PROJECT_DELETE = 210;

app.config.globalProperties.CONTEXTMENU_TAG_RENAME = 300;
app.config.globalProperties.CONTEXTMENU_TAG_DELETE = 310;
app.config.globalProperties.CONTEXTMENU_TAG_COLOR = 320;

app.config.globalProperties.DATA_TYPE_WORD = 3;
app.config.globalProperties.DATA_TYPE_PARAGRAPH = 2;
app.config.globalProperties.DATA_TYPE_SENTENCE = 1;

app.use(router)
    .use(vuetify)
    .use(VueSSE)
    .use(pinia)
    .use(ContextMenu)
    .mount('#app')
