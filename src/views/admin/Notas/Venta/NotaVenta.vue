<script setup lang="ts">

import { onMounted, ref } from 'vue';
import type { ProductoInterface } from '../../../../types/ProductoInterface';
import { Button, Column, DataTable, Dropdown, IconField, InputIcon, InputText } from 'primevue';
import productoService from '../../../../services/producto.service';
import sucursalService from '../../../../services/sucursal.service';
import almacenService from '../../../../services/almacen.service';
import { computed } from 'vue';


const productos = ref<ProductoInterface[]>([]);

const cargando = ref<boolean>(true);
const totalRecords = ref<number>(0);
const buscar = ref<string>("");
// const dt = ref();

// estados de filtro 
const sucursales = ref<any[]>([]);
const almacenes = ref<any[]>([]);

const filtroSucursal = ref<number | null>(null);
const filtroAlmacen = ref<number | null>(null);

const lazyParams = ref({
    page: 0,
    first: 0,
    rows: 10
});

const onPage = (event: any) => {
    lazyParams.value = event;
    listarProductos();
}

async function listarProductos() {
    const res = await productoService.index(lazyParams.value.page + 1, lazyParams.value.rows, buscar.value);
    productos.value = res.data.data;
    console.log(res.data);
    totalRecords.value = res.data.total;
    cargando.value = false;
}

const getImageUrl = (imagen: string) => {

    if (!imagen) return '';

    if (imagen.startsWith('http')) {
        return imagen;
    }

    return `http://localhost:3000/uploads/${encodeURIComponent(imagen)}`;
};

async function listarSucursales() {
    const res = await sucursalService.index();
    sucursales.value = res.data;
}

async function listarAlmacenes() {
    const res = await almacenService.index();
    almacenes.value = res.data;
}

onMounted(() => {
    listarProductos();
    listarSucursales();
    listarAlmacenes();
})

const almacenesFiltrados = computed(() => {

    if (!filtroSucursal.value) {
        return almacenes.value;
    }

    return almacenes.value.filter((almacen: any) => {

        if (typeof almacen.sucursal === 'object') {
            return almacen.sucursal.id == filtroSucursal.value;
        }

        return almacen.sucursal == filtroSucursal.value;
    });
});

const productosFiltrados = computed(() => {

    if (!filtroAlmacen.value) {
        return productos.value;
    }

    return productos.value.filter((producto: any) => {

        return producto.almacenes?.some((item: any) => {
            return item.almacen.id == filtroAlmacen.value;
        });
    });
});

</script>

<template>

    <div class="w-full flex overflow-hidden bg-gray-100">

        <!-- 📦 PRODUCTOS -->
        <div class="w-2/3 h-full p-3 overflow-hidden">

            <div class="h-full bg-white rounded-lg p-3 flex flex-col">

                <!-- <h2 class="text-lg font-semibold mb-3">Productos</h2> -->
                <!-- 🔎 FILTROS -->
                <div class="flex gap-2 mb-4">
                    <h4 class="m-0">Lista Productos</h4>
                </div>

                <DataTable class="" ref="dt" :value="productosFiltrados" paginator :rows="10" @page="onPage($event)"
                    lazy :loading="cargando" :totalRecords="totalRecords" :rowsPerPageOptions="[1, 2, 5, 10, 20, 50]"
                    tableStyle="min-width: 50rem">

                    <template #header>
                        <div class="flex flex-wrap gap-2 items-center justify-between">
                            <!-- SUCURSAL -->
                            <Dropdown v-model="filtroSucursal" :options="sucursales" optionLabel="nombre"
                                optionValue="id" placeholder="Filtrar por sucursal" class="w-64" showClear />

                            <!-- ALMACEN -->
                            <Dropdown v-model="filtroAlmacen" :options="almacenesFiltrados" optionLabel="nombre"
                                optionValue="id" placeholder="Filtrar por almacén" class="w-64" showClear />
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="buscar" placeholder="Search..." @keyup.enter="listarProductos()" />
                            </IconField>
                        </div>
                    </template>

                    <Column field="nombre" header="Name" style="width: 25%"></Column>
                    <!-- <Column field="descripcion" header="Country" style="width: 25%"></Column> -->
                    <Column field="precio_venta_actual" header="Company" style="width: 25%"></Column>
                    <Column field="marca" header="Marca" style="width: 25%"></Column>
                    <Column header="Imagen" style="width: 25%">
                        <template #body="{ data }">
                            <img :src="getImageUrl(data.imagen)" alt="producto"
                                style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" />
                        </template>
                    </Column>
                    <Column :exportable="false" style="min-width: 12rem" header="Acciones">
                        <template #body="slotProps">
                            <div class="flex gap-1">
                                <Button icon="pi pi-minus" rounded severity="warn" />
                                <Button icon="pi pi-plus" rounded severity="info" />
                            </div>
                        </template>
                    </Column>
                </DataTable>

            </div>

        </div>

        <!-- 🧾 PANEL DERECHO -->
        <div class="w-1/3 h-full p-3 flex flex-col gap-3">

            <!-- 🛒 CARRITO -->
            <div class="flex-1 bg-white rounded-lg p-3 overflow-y-auto">

                <h2 class="text-lg font-semibold mb-3">Carrito</h2>

                <div class="border-b py-2">Producto A - 2 x 100</div>

            </div>

            <!-- 👤 CLIENTE -->
            <div class="bg-white rounded-lg p-3">

                <h2 class="text-lg font-semibold mb-2">Cliente</h2>

                <input class="w-full border rounded p-2 mb-2" placeholder="Nombre" />
                <input class="w-full border rounded p-2 mb-2" placeholder="CI / NIT" />
                <input class="w-full border rounded p-2" placeholder="Teléfono" />

            </div>

            <!-- ✅ PEDIDO -->
            <div class="bg-white rounded-lg p-3">

                <div class="flex justify-between mb-3">
                    <span>Total</span>
                    <strong>0.00 Bs</strong>
                </div>

                <button class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
                    Generar Pedido
                </button>

            </div>

        </div>

    </div>

</template>