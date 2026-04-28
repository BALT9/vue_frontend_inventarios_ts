import { createRouter, createWebHistory } from "vue-router";
import Inicio from "../views/web/Inicio.vue";
import Servicios from "../views/web/Servicios.vue";
import Nosotros from "../views/web/Nosotros.vue";

const routes = [
    {
        path: '/',
        component: Inicio
    },
    {
        path: '/nosotros',
        component: Nosotros
    },
    {
        path: '/servicios',
        component: Servicios
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router;