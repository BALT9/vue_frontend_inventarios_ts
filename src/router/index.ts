import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

import Inicio from "../views/web/Inicio.vue";
import Servicios from "../views/web/Servicios.vue";
import Nosotros from "../views/web/Nosotros.vue";
import Login from "../views/auth/Login.vue";

import Perfil from "../views/admin/Perfil.vue";
import Users from "../views/admin/users/Users.vue";
import WebLayout from "../components/WebLayout.vue";

import AppLayout from "../layout/AppLayout.vue";
import Categoria from "../views/admin/Inventario/categoria/Categoria.vue";
import Producto from "../views/admin/Inventario/producto/Producto.vue";
import Sucursal from "../views/admin/Inventario/sucursal/Sucursal.vue";
import Almacen from "../views/admin/Inventario/Almacen/Almacen.vue";
import NotaVenta from "../views/admin/Notas/Venta/NotaVenta.vue";
import NotaCompra from "../views/admin/Notas/Compra/NotaCompra.vue";
import Movimientos from "../views/admin/Notas/Movimientos/Movimientos.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: WebLayout,
        children: [
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
        ]
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
            },
            {
                path: "categoria",
                name: "Categoria",
                component: Categoria
            },
            {
                path: "producto",
                name: "Producto",
                component: Producto
            },
            {
                path: "sucursal",
                name: "Sucursal",
                component: Sucursal
            },
            {
                path: "almacen",
                name: "Almacen",
                component: Almacen
            },
            {
                path: "notas",
                children: [
                    {path: 'nueva-venta', component: NotaVenta, name: "NotaVenta", meta: {requireAuth: true}},
                    {path: 'nueva-compra', component: NotaCompra, name: "NotaCompra", meta: {requireAuth: true}},
                    {path: 'movimientos', component: Movimientos, name: "Movimientos", meta: {requireAuth: true}}
                ]
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;