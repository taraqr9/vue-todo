import {createRouter, createWebHistory} from "vue-router";
import Index from '../views/Index.vue'
import TodoCreate from '../views/Create.vue'
import TodoView from '../views/View.vue'
import TodoEdit from '../views/Edit.vue'
import About from '../About.vue'
import Login from "../views/auth/login.vue";
import {useUserStore} from "../js/user.js";

const stateUser = useUserStore();

const routes = [
    {path: '/index', component: Index},
    {path: '/', component: Index},
    {path: '/todo/create', component: TodoCreate},
    {path: '/todo/:id', component: TodoView},
    {path: '/todo/:id/edit', component: TodoEdit},
    {path: '/login', component: Login},
    {path: '/about', component: About},
    // {
    //     path: '/logout',
    //     beforeEnter: (to, from, next) => {
    //         // Call your logout function here
    //         // For example, call a logout function from your store or wherever it's defined
    //         // Example: store.dispatch('logout')
    //         // After logout logic, you can redirect to a different route or perform other actions
    //         stateUser.logout();
    //         next('/login'); // Redirect to the login page after logout
    //     }
    // } manually hit /logout route, it should logout.
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router