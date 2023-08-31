import { createApp } from 'vue'
import './style.css'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Index from './views/Index.vue'
import TodoCreate from './views/Create.vue'
import TodoView from './views/View.vue'
import TodoEdit from './views/Edit.vue'
import About from './views/About.vue'

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
            component: About
        }
    ]
})

createApp(App)
.use(router)
.mount('#app')
