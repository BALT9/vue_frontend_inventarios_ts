import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import Inicio from "../views/web/Inicio.vue";
import Servicios from "../views/web/Servicios.vue";
import Nosotros from "../views/web/Nosotros.vue";
import Login from "../views/auth/Login.vue";
import Perfil from "../views/admin/Perfil.vue";

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
        component: Login, name: 'Login', meta: { redirectIfAuth: true }
    },
    {
        path: '/admin/perfil',
        component: Perfil, name: 'Perfil', meta: { requireAuth: true }
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

// redirigir al panel si ya estoy logeado
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("access_token");

    if (to.meta.requireAuth) {
        if (!token) {
            return next({ name: 'Login' })
        } else {
            return next();
        }
    }

    if (to.meta.redirectIfAuth && token) {
        return next({ name: 'Perfil' })
    }

    return next();
})

export default router;