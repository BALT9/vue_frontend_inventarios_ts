<script setup lang="ts">

import { onMounted, ref, computed } from 'vue';

import type { ProductoInterface } from '../../../../types/ProductoInterface';
import type { ClienteInterface } from '../../../../types/Cliente-ProovedorInterface';

import {
    Button,
    Column,
    DataTable,
    Dialog,
    Dropdown,
    IconField,
    InputIcon,
    InputText,
    InputNumber
} from 'primevue';

import productoService from '../../../../services/producto.service';
import sucursalService from '../../../../services/sucursal.service';
import almacenService from '../../../../services/almacen.service';
import clienteProveedorService from '../../../../services/cliente-proveedor.service';
import notaService from '../../../../services/nota.service';


// =========================
// ESTADOS
// =========================

const productos = ref<ProductoInterface[]>([]);

const cargando = ref<boolean>(true);

const totalRecords = ref<number>(0);

const buscar = ref<string>("");


// =========================
// FILTROS
// =========================

const sucursales = ref<any[]>([]);

const almacenes = ref<any[]>([]);

const filtroSucursal = ref<number | null>(null);

const filtroAlmacen = ref<number | null>(null);


// =========================
// CARRITO
// =========================

const carrito = ref<any[]>([]);


// =========================
// PROVEEDORES
// =========================

const visibleProveedor = ref<boolean>(false);

const proveedores = ref<ClienteInterface[]>([]);

const proveedorSeleccionado = ref<ClienteInterface | null>(null);

const proveedorForm = ref<ClienteInterface>({
    tipo: 'proveedor',
    razon_social: '',
    identificacion: '',
    telefono: '',
    direccion: '',
    correo: '',
    estado: true
});


// =========================
// PAGINACION
// =========================

const lazyParams = ref({
    page: 0,
    first: 0,
    rows: 10
});


// =========================
// PAGINACION EVENTO
// =========================

const onPage = (event: any) => {

    lazyParams.value = event;

    listarProductos();
};


// =========================
// PRODUCTOS
// =========================

async function listarProductos() {

    cargando.value = true;

    const res = await productoService.index(
        lazyParams.value.page + 1,
        lazyParams.value.rows,
        buscar.value
    );

    productos.value = res.data.data;

    totalRecords.value = res.data.total;

    cargando.value = false;
}


// =========================
// IMAGEN
// =========================

const getImageUrl = (imagen: string) => {

    if (!imagen) return '';

    if (imagen.startsWith('http')) {
        return imagen;
    }

    return `http://localhost:3000/uploads/${encodeURIComponent(imagen)}`;
};


// =========================
// SUCURSALES
// =========================

async function listarSucursales() {

    const res = await sucursalService.index();

    sucursales.value = res.data;
}


// =========================
// ALMACENES
// =========================

async function listarAlmacenes() {

    const res = await almacenService.index();

    almacenes.value = res.data;
}


// =========================
// PROVEEDORES
// =========================

async function listarProveedores() {

    const res = await clienteProveedorService.index();

    proveedores.value = res.data;
}


// =========================
// ON MOUNTED
// =========================

onMounted(() => {

    listarProductos();

    listarSucursales();

    listarAlmacenes();

    listarProveedores();
});


// =========================
// ALMACENES FILTRADOS
// =========================

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


// =========================
// PRODUCTOS FILTRADOS
// =========================

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


// =========================
// AGREGAR PRODUCTO
// =========================

function agregarProducto(prod: any) {

    const existe = carrito.value.find(
        item => item.id === prod.id
    );

    const precioCompra = Number(
        prod.precio_venta_actual ?? 0
    );

    if (existe) {

        existe.cantidad++;

    } else {

        carrito.value.push({
            ...prod,
            cantidad: 1,
            precio: precioCompra
        });
    }
}


// =========================
// ELIMINAR PRODUCTO
// =========================

function eliminarProducto(prod: any) {

    carrito.value = carrito.value.filter(
        item => item.id !== prod.id
    );
}


// =========================
// GUARDAR PROVEEDOR
// =========================

async function guardarProveedor() {

    try {

        await clienteProveedorService.store(proveedorForm.value);

        await listarProveedores();

        visibleProveedor.value = false;

        proveedorForm.value = {
            tipo: 'proveedor',
            razon_social: '',
            identificacion: '',
            telefono: '',
            direccion: '',
            correo: '',
            estado: true
        };

    } catch (error) {

        console.error(error);

        alert("Error al guardar proveedor");
    }
}


// =========================
// PROVEEDORES FILTRADOS
// =========================

const proveedoresFiltrados = computed(() => {

    return proveedores.value.filter(
        proveedor => proveedor.tipo === 'proveedor'
    );
});


// =========================
// SELECCIONAR PROVEEDOR
// =========================

function seleccionarProveedor(proveedor: ClienteInterface) {

    proveedorSeleccionado.value = proveedor;
}


// =========================
// TOTAL
// =========================

const total = computed(() => {

    return carrito.value.reduce((acc, item) => {

        return acc + (
            item.cantidad * parseFloat(item.precio)
        );

    }, 0);
});


// =========================
// GENERAR COMPRA
// =========================

async function generarCompra() {

    try {

        if (!proveedorSeleccionado.value) {

            alert("Selecciona un proveedor");

            return;
        }

        if (carrito.value.length === 0) {

            alert("El carrito está vacío");

            return;
        }

        const movimientos = carrito.value.map(item => {

            const almacenSeleccionado = item.almacenes?.find((a: any) =>
                a.almacen.id == filtroAlmacen.value
            );

            return {
                producto_id: item.id,
                almacen_id: filtroAlmacen.value || almacenSeleccionado?.almacen.id,
                cantidad: item.cantidad,

                tipo_movimiento: "ingreso", // 👈 AQUÍ EL FIX

                precio_unitario_compra: item.precio,
                precio_unitario_venta: item.precio_venta_actual ?? 0,
                observaciones: ""
            };
        });

        const user_id = localStorage.getItem("user_id");

        const payload = {

            fecha: new Date()
                .toISOString()
                .split("T")[0],

            tipo_nota: "compra",

            cliente_id: proveedorSeleccionado.value.id,

            user_id: user_id,

            estado_nota: "Completado",

            observaciones: "",

            movimientos
        };

        const res = await notaService.store(payload);

        console.log("Compra creada:", res.data);

        carrito.value = [];

        proveedorSeleccionado.value = null;

        await listarProductos();

        alert("Compra generada correctamente");

    } catch (error) {

        console.error(error);

        alert("Error al generar compra");
    }
}

</script>

<template>

    <div class="w-full flex overflow-hidden bg-gray-100">

        <!-- ========================= -->
        <!-- PRODUCTOS -->
        <!-- ========================= -->

        <div class="w-2/3 h-full p-3 overflow-hidden">

            <div class="h-full bg-white rounded-lg p-3 flex flex-col">

                <div class="flex gap-2 mb-4">
                    <h4 class="m-0">
                        Lista Productos
                    </h4>
                </div>

                <DataTable :value="productosFiltrados" paginator :rows="10" @page="onPage($event)" lazy
                    :loading="cargando" :totalRecords="totalRecords" :rowsPerPageOptions="[5, 10, 20, 50]"
                    tableStyle="min-width: 50rem">

                    <!-- HEADER -->
                    <template #header>

                        <div class="flex flex-wrap gap-2 items-center justify-between">

                            <!-- SUCURSAL -->
                            <Dropdown v-model="filtroSucursal" :options="sucursales" optionLabel="nombre"
                                optionValue="id" placeholder="Filtrar por sucursal" class="w-64" showClear />

                            <!-- ALMACEN -->
                            <Dropdown v-model="filtroAlmacen" :options="almacenesFiltrados" optionLabel="nombre"
                                optionValue="id" placeholder="Filtrar por almacén" class="w-64" showClear />

                            <!-- BUSCAR -->
                            <IconField>

                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>

                                <InputText v-model="buscar" placeholder="Buscar..." @keyup.enter="listarProductos()" />

                            </IconField>

                        </div>

                    </template>

                    <!-- COLUMNAS -->

                    <Column field="nombre" header="Nombre" />

                    <Column field="precio_compra_actual" header="Precio Compra" />

                    <Column field="marca" header="Marca" />

                    <!-- IMAGEN -->
                    <Column header="Imagen">

                        <template #body="{ data }">

                            <img :src="getImageUrl(data.imagen)" alt="producto" style="
                                    width: 60px;
                                    height: 60px;
                                    object-fit: cover;
                                    border-radius: 8px;
                                " />

                        </template>

                    </Column>

                    <!-- STOCK -->
                    <Column header="Stock">

                        <template #body="{ data }">

                            {{
                                data.almacenes?.find(
                                    (a: any) =>
                                        a.almacen.id == filtroAlmacen
                                )?.cantidad_actual ?? 0
                            }}

                        </template>

                    </Column>

                    <!-- ACCIONES -->
                    <Column :exportable="false" header="Acciones">

                        <template #body="slotProps">

                            <Button icon="pi pi-plus" rounded severity="info"
                                @click="agregarProducto(slotProps.data)" />

                        </template>

                    </Column>

                </DataTable>

            </div>

        </div>


        <!-- ========================= -->
        <!-- PANEL DERECHO -->
        <!-- ========================= -->

        <div class="w-1/3 h-full p-3 flex flex-col gap-3">

            <!-- ========================= -->
            <!-- CARRITO -->
            <!-- ========================= -->

            <div class="flex-1 bg-white rounded-lg p-3 overflow-y-auto">

                <h2 class="text-lg font-semibold mb-3">
                    Compra
                </h2>

                <DataTable :value="carrito" tableStyle="min-width: 50rem">

                    <Column field="nombre" header="Nombre" />

                    <!-- CANTIDAD -->
                    <Column header="Cantidad">

                        <template #body="{ data }">

                            <InputNumber v-model="data.cantidad" showButtons buttonLayout="horizontal" :min="1" />

                        </template>

                    </Column>

                    <!-- PRECIO -->
                    <Column header="Precio">

                        <template #body="{ data }">

                            <InputNumber v-model="data.precio" mode="decimal" :min="0" :minFractionDigits="2"
                                :maxFractionDigits="2" fluid />

                        </template>

                    </Column>

                    <!-- SUBTOTAL -->
                    <Column header="Subtotal">

                        <template #body="{ data }">

                            {{
                                (
                                    data.cantidad * data.precio
                                ).toFixed(2)
                            }} Bs

                        </template>

                    </Column>

                    <!-- ACCIONES -->
                    <Column :exportable="false" header="Acciones">

                        <template #body="slotProps">

                            <Button icon="pi pi-trash" variant="outlined" rounded severity="danger"
                                @click="eliminarProducto(slotProps.data)" />

                        </template>

                    </Column>

                </DataTable>

            </div>


            <!-- ========================= -->
            <!-- PROVEEDOR -->
            <!-- ========================= -->

            <div class="bg-white rounded-lg p-3">

                <div class="flex justify-between items-center mb-2">

                    <h2 class="text-lg font-semibold">
                        Proveedor
                    </h2>

                    <Button icon="pi pi-plus" label="Nuevo" size="small" @click="visibleProveedor = true" />

                </div>


                <!-- PROVEEDOR SELECCIONADO -->

                <div v-if="proveedorSeleccionado" class="mb-3 p-2 border rounded bg-green-50">

                    <div class="font-semibold">
                        {{ proveedorSeleccionado.razon_social }}
                    </div>

                    <div class="text-sm text-gray-600">
                        {{ proveedorSeleccionado.identificacion }}
                    </div>

                    <div class="text-sm text-gray-600">
                        {{ proveedorSeleccionado.telefono }}
                    </div>

                </div>


                <!-- DIALOG -->

                <Dialog v-model:visible="visibleProveedor" modal header="Nuevo Proveedor" :style="{ width: '35rem' }">

                    <div class="flex flex-col gap-3">

                        <div>

                            <label class="block mb-1">
                                Razón Social
                            </label>

                            <InputText v-model="proveedorForm.razon_social" class="w-full" />

                        </div>

                        <div>

                            <label class="block mb-1">
                                CI / NIT
                            </label>

                            <InputText v-model="proveedorForm.identificacion" class="w-full" />

                        </div>

                        <div>

                            <label class="block mb-1">
                                Teléfono
                            </label>

                            <InputText v-model="proveedorForm.telefono" class="w-full" />

                        </div>

                        <div>

                            <label class="block mb-1">
                                Dirección
                            </label>

                            <InputText v-model="proveedorForm.direccion" class="w-full" />

                        </div>

                        <div>

                            <label class="block mb-1">
                                Correo
                            </label>

                            <InputText v-model="proveedorForm.correo" class="w-full" />

                        </div>

                    </div>

                    <template #footer>

                        <div class="flex justify-end gap-2">

                            <Button label="Cancelar" severity="secondary" @click="visibleProveedor = false" />

                            <Button label="Guardar" icon="pi pi-save" @click="guardarProveedor" />

                        </div>

                    </template>

                </Dialog>


                <!-- TABLA PROVEEDORES -->

                <DataTable :value="proveedoresFiltrados" tableStyle="min-width: 50rem">

                    <Column field="id" header="ID" />

                    <Column field="razon_social" header="Nombre" />

                    <Column field="telefono" header="Telefono" />

                    <Column :exportable="false" header="Acciones">

                        <template #body="slotProps">

                            <Button icon="pi pi-plus" rounded severity="info"
                                @click="seleccionarProveedor(slotProps.data)" />

                        </template>

                    </Column>

                </DataTable>

            </div>


            <!-- ========================= -->
            <!-- TOTAL -->
            <!-- ========================= -->

            <div class="bg-white rounded-lg p-3">

                <div class="flex justify-between mb-3">

                    <span>Total</span>

                    <strong>
                        {{ total.toFixed(2) }} Bs
                    </strong>

                </div>

                <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded" @click="generarCompra()">
                    Generar Compra
                </button>

            </div>

        </div>

    </div>

</template>