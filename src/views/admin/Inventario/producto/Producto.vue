<script setup lang="ts">

import { onMounted, ref } from 'vue';
import productoService from '../../../../services/producto.service';
import type { ProductoInterface } from '../../../../types/ProductoInterface';
import { Column, DataTable } from 'primevue';


const productos = ref<ProductoInterface[]>([]);

async function listarProductos() {
    const res = await productoService.index(1, 2, "");
    productos.value = res.data.data;
    console.log(res.data);
}

onMounted(() => {
    listarProductos();
})

</script>

<template>
    <h1>productos</h1>

    <div class="card">
        <DataTable :value="productos" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 50rem">
            <Column field="nombre" header="Name" style="width: 25%"></Column>
            <Column field="descripcion" header="Country" style="width: 25%"></Column>
            <Column field="precio_venta_actual" header="Company" style="width: 25%"></Column>
            <Column field="estado" header="Representative" style="width: 25%"></Column>
        </DataTable>
    </div>


    <pre>{{ JSON.stringify(productos, null, 2) }}</pre>
</template>