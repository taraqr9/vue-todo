import {createRouter, createWebHistory} from "vue-router";
import Index from '../views/Index.vue'
import TodoCreate from '../views/Create.vue'
import TodoView from '../views/View.vue'
import TodoEdit from '../views/Edit.vue'
import About from '../About.vue'
import Login from "../views/auth/login.vue";
import Profile from "../views/auth/Profile.vue";
import NotFound from "../views/auth/NotFound.vue";

const routes = [
    {path: '/index', component: Index},
    {path: '/', component: Index},
    {path: '/todo/create', component: TodoCreate},
    {path: '/todo/:id', component: TodoView},
    {path: '/todo/:id/edit', component: TodoEdit},
    {path: '/login', component: Login},
    {path: '/profile', component: Profile},
    {path: '/about', component: About},
    { path: '/:pathMatch(.*)*', component: NotFound },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || (user.auth !== true && to.path !== '/login')) {
        next({path: '/login'});
    }
    else if (user.auth === true && to.path === '/login') {
        next({ path: '/index'});
    }
    else {
        next();
    }
});

export default router