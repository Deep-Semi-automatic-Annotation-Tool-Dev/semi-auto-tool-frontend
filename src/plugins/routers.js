import { createRouter, createWebHashHistory } from 'vue-router';

// import IndexComponenet from '@/components/Index';
import ProjectComponenet from '@/components/Project';
import DashboardComponenet from '@/components/Dashboard';
import HelpComponent from '@/components/Help';

// Vue 라우터 인스턴스 생성
const router = new createRouter({
    history: createWebHashHistory(),
    routes: [
        // TODO: 추가한 페이지 여기에 추가
        // {path: '/', component: IndexComponenet, name: 'index'},
        {path: '/', redirect: '/project'},
        {path: '/project', component: ProjectComponenet, name: 'project'},
        {path: '/dashboard', component: DashboardComponenet, name: 'dashboard'},
        {path: '/help', component: HelpComponent, name: 'help'},
    ]
});

export default router;