import { createRouter, createWebHashHistory } from 'vue-router';

import IndexComponenet from '@/components/Index';
import ProjectComponenet from '@/components/Project';

// Vue 라우터 인스턴스 생성
const router = new createRouter({
    history: createWebHashHistory(),
    routes: [
        // TODO: 추가한 페이지 여기에 추가
        {path: '/', component: IndexComponenet},
        {path: '/project', component: ProjectComponenet}
    ]
});

export default router;