<script setup lang="ts">

import { onMounted, ref } from 'vue';
import productoService from '../../../../services/producto.service';
import type { ProductoInterface } from '../../../../types/ProductoInterface';
import { Button, Column, DataTable, Dialog, FileUpload, InputText, Toolbar } from 'primevue';


const productos = ref<ProductoInterface[]>([]);

const visible = ref<boolean>(false);

const cargando = ref<boolean>(true);
const totalRecords = ref<number>(0);

const dt = ref();

const lazyParams = ref({
    page: 0,
    rows: 10
});

async function listarProductos() {
    const res = await productoService.index(lazyParams.value.page + 1, lazyParams.value.rows);
    productos.value = res.data.data;
    console.log(res.data);
    totalRecords.value = res.data.total;
    cargando.value = false;
}

onMounted(() => {
    listarProductos();
})

const onPage = (event: any) => {
    lazyParams.value = event;
    listarProductos();
}

const exportCSV = (event: any) => {
    dt.value.exportCSV();
};


</script>

<template>
    <h1>productos</h1>

    <div class="card flex justify-center">
        <Button label="Crear Producto" @click="visible = true" />
        <Dialog v-model:visible="visible" modal header="Crear Categoria" :style="{ width: '25rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Categoria</span>
            <div class="flex items-center gap-4 mb-4">
                <label for="nombre" class="font-semibold w-24">Nombre</label>
                <InputText id="nombre" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="descripcion" class="font-semibold w-24">Descripcion</label>
                <InputText id="descripcion" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Save" @click=""></Button>
            </div>
            <!-- {{ categoria }} -->
        </Dialog>
    </div>

    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="New" icon="pi pi-plus" class="mr-2" @click="" />
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
                <Column field="nombre" header="Name" style="width: 25%"></Column>
                <Column field="descripcion" header="Country" style="width: 25%"></Column>
                <Column field="precio_venta_actual" header="Company" style="width: 25%"></Column>
                <Column field="marca" header="Marca" style="width: 25%"></Column>
            </DataTable>
        </div>
    </div>


    <pre>{{ JSON.stringify(productos, null, 2) }}</pre>
</template>