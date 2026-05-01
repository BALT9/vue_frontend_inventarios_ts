import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import Inicio from "../views/web/Inicio.vue";
import Servicios from "../views/web/Servicios.vue";
import Nosotros from "../views/web/Nosotros.vue";
import Login from "../views/auth/Login.vue";

// Navegacion con Vue Router 

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: Inicio,
    },
    {
        path: '/nosotros',
        component: Nosotros
    },
    {
        path: '/servicios',
        component: Servicios
    },
    {
        path: '/login',
        component: Login
    }

]; 

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router;