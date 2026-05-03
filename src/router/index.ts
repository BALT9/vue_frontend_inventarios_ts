import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

import Inicio from "../views/web/Inicio.vue";
import Servicios from "../views/web/Servicios.vue";
import Nosotros from "../views/web/Nosotros.vue";
import Login from "../views/auth/Login.vue";

import Perfil from "../views/admin/Perfil.vue";
import Users from "../views/admin/users/Users.vue";

import AppLayout from "../layout/AppLayout.vue";

const routes: Array<RouteRecordRaw> = [

    // 🌐 PUBLICO (sin layout admin)
    {
        path: "/",
        component: Inicio
    },
    {
        path: "/nosotros",
        component: Nosotros
    },
    {
        path: "/servicios",
        component: Servicios
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        meta: { redirectIfAuth: true }
    },

    // 🔐 ADMIN (con layout Sakai)
    {
        path: "/admin",
        component: AppLayout,
        meta: { requireAuth: true },
        children: [
            {
                path: "perfil",
                name: "Perfil",
                component: Perfil
            },
            {
                path: "users",
                name: "Users",
                component: Users
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;