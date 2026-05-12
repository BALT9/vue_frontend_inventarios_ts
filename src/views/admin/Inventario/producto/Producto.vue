<script setup lang="ts">

import { onMounted, ref } from 'vue';
import productoService from '../../../../services/producto.service';
import type { ProductoInterface } from '../../../../types/ProductoInterface';
import { Button, Column, DataTable, Dialog, Dropdown, FileUpload, IconField, InputIcon, InputText, Toolbar } from 'primevue';
import categoriaService from '../../../../services/categoria.service';

// manejo de estados con pinia 
import { useCounterStore } from '../../../../stores/counter';
// habilitador de manejo de estados con pinia 
const counter = useCounterStore()

const productos = ref<ProductoInterface[]>([]);

const productoDataBlank = {
    nombre: '',
    descripcion: '',
    unidad_medida: '',
    marca: '',
    precio_venta_actual: "",
    imagen: '',
    estado: true,
    categoria: 0
}

const producto = ref<ProductoInterface>(productoDataBlank);

const categorias = ref<any[]>([]);

const visible = ref<boolean>(false);

const cargando = ref<boolean>(true);
const totalRecords = ref<number>(0);
const buscar = ref<string>("");

const imagenSeleccionada = ref();

const dt = ref();

const lazyParams = ref({
    page: 0,
    first: 0,
    rows: 10
});

async function listarProductos() {
    const res = await productoService.index(lazyParams.value.page + 1, lazyParams.value.rows, buscar.value);
    productos.value = res.data.data;
    console.log(res.data);
    totalRecords.value = res.data.total;
    cargando.value = false;
}

async function listarCategorias() {
    const res = await categoriaService.index();
    categorias.value = res.data;

    console.log(JSON.stringify(categorias.value, null, 2));
}

onMounted(() => {
    listarProductos();
    listarCategorias();
})

const onPage = (event: any) => {
    lazyParams.value = event;
    listarProductos();
}

const exportCSV = (event: any) => {
    console.log(event);
    dt.value.exportCSV();
};


async function guardarProducto() {
    try {
        if (producto.value.id) {

            const payload: ProductoInterface = {
                nombre: producto.value.nombre,
                descripcion: producto.value.descripcion,
                unidad_medida: producto.value.unidad_medida,
                marca: producto.value.marca,
                precio_venta_actual: producto.value.precio_venta_actual,
                imagen: producto.value.imagen,
                estado: producto.value.estado,
                categoria: producto.value.categoria
            }

            const res = await productoService.update(producto.value.id, payload);
            console.log(res.data);
            visible.value = false;
            producto.value = productoDataBlank;
        } else {
            const res = await productoService.store(producto.value);
            console.log(res.data);
            visible.value = false;
            listarProductos();
        }
    } catch (error) {

    }
}

async function editarProducto(dataProducto: ProductoInterface) {
    visible.value = true;
    producto.value = dataProducto;
}

async function eliminarProducto(dataProducto: ProductoInterface) {
    if (dataProducto.id) {
        await productoService.delete(dataProducto.id);
        listarProductos();
    }
}

const onFileSelect = async (event: any) => {
    imagenSeleccionada.value = event.files[0];

    const formData = new FormData();
    formData.append("imagen", imagenSeleccionada.value);

    if (producto.value.id) {
        const { data } = await productoService.actualizaImagen(producto.value.id, formData);
        console.log(data);
    }

    // visible.value = false;

    listarProductos();
}

const getImageUrl = (imagen: string) => {

    if (!imagen) return '';

    if (imagen.startsWith('http')) {
        return imagen;
    }

    return `http://localhost:3000/uploads/${encodeURIComponent(imagen)}`;
};


</script>

<template>
    <h1>productos</h1>

    <div class="flex justify-center">
        <Dialog v-model:visible="visible" modal header="Crear Producto" :style="{ width: '35rem' }">

            <div class="flex flex-col gap-4">

                <div class="flex items-center gap-4">
                    <label for="nombre" class="font-semibold w-40">
                        Nombre
                    </label>

                    <InputText id="nombre" v-model="producto.nombre" class="flex-auto" autocomplete="off" />
                </div>

                <div class="flex items-center gap-4">
                    <label for="descripcion" class="font-semibold w-40">
                        Descripción
                    </label>

                    <InputText id="descripcion" v-model="producto.descripcion" class="flex-auto" autocomplete="off" />
                </div>

                <div class="flex items-center gap-4">
                    <label for="unidad_medida" class="font-semibold w-40">
                        Unidad
                    </label>

                    <InputText id="unidad_medida" v-model="producto.unidad_medida" class="flex-auto"
                        autocomplete="off" />
                </div>

                <div class="flex items-center gap-4">
                    <label for="marca" class="font-semibold w-40">
                        Marca
                    </label>

                    <InputText id="marca" v-model="producto.marca" class="flex-auto" autocomplete="off" />
                </div>

                <div class="flex items-center gap-4">
                    <label for="precio" class="font-semibold w-40">
                        Precio
                    </label>

                    <InputText id="precio" v-model="producto.precio_venta_actual" type="number" class="flex-auto" />
                </div>

                <div class="flex items-center gap-4">
                    <label for="imagen" class="font-semibold w-40">
                        Imagen
                    </label>

                    <InputText id="imagen" v-model="producto.imagen" class="flex-auto" autocomplete="off" />
                </div>

                <div>
                    <!-- onAdvancedUpload($event) -->
                    <FileUpload name="demo[]" customUpload @select="onFileSelect" :multiple="false" accept="image/*"
                        :maxFileSize="1000000">
                        <template #empty>
                            <span>Drag and drop files to here to upload.</span>
                        </template>
                    </FileUpload>
                </div>

                <div class="flex items-center gap-4">
                    <label for="categoria" class="font-semibold w-40">
                        Categoria
                    </label>

                    <Dropdown v-model="producto.categoria" :options="categorias" optionLabel="nombre" optionValue="id"
                        placeholder="Selecciona categoría" />
                </div>

            </div>

            <template #footer>
                <div class="flex justify-end gap-2">
                    <Button type="button" label="Cancelar" severity="secondary" @click="visible = false" />

                    <Button type="button" label="Guardar" @click="guardarProducto()" />
                </div>
            </template>

            <pre>{{ producto }}</pre>
        </Dialog>
    </div>

    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Agregar Producto" icon="pi pi-plus" class="mr-2" @click="visible = true" />
            </template>

            <template #end>
                <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" customUpload
                    chooseLabel="Import" class="mr-2" auto :chooseButtonProps="{ severity: 'secondary' }" />
                <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
            </template>
        </Toolbar>

        <div class="card">
            <DataTable ref="dt" :value="productos" paginator :rows="10" @page="onPage($event)" lazy :loading="cargando"
                :totalRecords="totalRecords" :rowsPerPageOptions="[1, 2, 5, 10, 20, 50]" tableStyle="min-width: 50rem">

                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Products</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="buscar" placeholder="Search..." @keyup.enter="listarProductos()" />
                        </IconField>
                    </div>
                </template>

                <Column field="nombre" header="Name" style="width: 25%"></Column>
                <Column field="descripcion" header="Country" style="width: 25%"></Column>
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
                        <Button icon="pi pi-pencil" variant="outlined" rounded class="mr-2"
                            @click="editarProducto(slotProps.data)" />
                        <Button icon="pi pi-trash" variant="outlined" rounded severity="danger"
                            @click="eliminarProducto(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
    <div>
        <p>{{ counter.contador }}</p>
        <button @click="counter.incrementar">Incrementar +</button>
    </div>

    <pre>{{ JSON.stringify(productos, null, 2) }}</pre>
</template>