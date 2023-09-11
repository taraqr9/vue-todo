import { createApp } from 'vue'
import './style.css'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Index from './views/Index.vue'
import TodoCreate from './views/Create.vue'
import TodoView from './views/View.vue'
import TodoEdit from './views/Edit.vue'
import About from './About.vue'
import Toaster from "@meforma/vue-toaster";
import Login from "./views/auth/login.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/todo/create',
            name: 'todo-create',
            component: TodoCreate
        },
        {
            path: '/',
            name: 'index',
            component: Index
        },
        {
            path: '/todo/:id',
            name: 'todo-view',
            component: TodoView
        },
        {
            path: '/todo/:id/edit',
            name: 'todo-edit',
            component: TodoEdit
        },
        {
            path: '/about',
            name: 'about',
            component: About,
            beforeEnter: (to, from, next) => {
                const log = false;

                if(!log){
                    return next({
                        name: 'login'
                    })
                }
                console.log("middleware");
                next();
            }
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
    ]
})

createApp(App)
    .use(router)
    .use(Toaster)
    .mount('#app')
