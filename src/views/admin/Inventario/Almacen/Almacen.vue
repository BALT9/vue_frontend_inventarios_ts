<script setup lang="ts">

import { computed, onMounted, ref } from 'vue';

import almacenService from '../../../../services/almacen.service';
import sucursalService from '../../../../services/sucursal.service';

import type { AlmacenInterface } from '../../../../types/AlmacenInterface';
import type { SucursalInterface } from '../../../../types/SucursalInterface';

import {
    Button,
    Column,
    DataTable,
    Dialog,
    InputText,
    Select
} from 'primevue';

const almacenes = ref<AlmacenInterface[]>([]);
const sucursales = ref<SucursalInterface[]>([]);

const filtroSucursal = ref<string | null>(null);

const almacenBlank: AlmacenInterface = {
    nombre: "",
    codigo: "",
    descripcion: "",
    sucursal: undefined
}

const almacen = ref<AlmacenInterface>({
    ...almacenBlank
});

const visible = ref<boolean>(false);

async function funListarAlmacenes() {

    const res = await almacenService.index();

    console.log(res.data);

    almacenes.value = res.data;
}

async function funListarSucursales() {

    const res = await sucursalService.index();

    sucursales.value = res.data;
}

async function funGuardarAlmacen() {

    try {

        const payload: AlmacenInterface = {
            nombre: almacen.value.nombre,
            codigo: almacen.value.codigo,
            descripcion: almacen.value.descripcion,
            sucursal: almacen.value.sucursal
        };

        if (almacen.value.id) {

            await almacenService.update(
                almacen.value.id,
                payload
            );

        } else {

            await almacenService.store(payload);
        }

        visible.value = false;

        almacen.value = { ...almacenBlank };

        funListarAlmacenes();

    } catch (error) {

        console.log(error);
    }
}

function editarAlmacen(data: AlmacenInterface) {

    visible.value = true;

    almacen.value = {
        ...data,
        sucursal:
            typeof data.sucursal === 'object'
                ? data.sucursal.id
                : data.sucursal
    };
}

async function eliminarAlmacen(data: AlmacenInterface) {

    if (data.id) {

        await almacenService.delete(data.id);

        funListarAlmacenes();
    }
}

const almacenesFiltrados = computed(() => {

    if (!filtroSucursal.value) {
        return almacenes.value;
    }

    return almacenes.value.filter((item) => {

        if (typeof item.sucursal === 'object' && item.sucursal) {
            return item.sucursal.id == filtroSucursal.value;
        }

        return item.sucursal == filtroSucursal.value;
    });
});

onMounted(() => {

    funListarAlmacenes();

    funListarSucursales();
});

</script>

<template>

    <h1>Almacen</h1>

    <div class="flex gap-2 mb-4">

        <Button label="Crear Almacen" @click="visible = true" />

        <!-- FILTRO -->
        <Select v-model="filtroSucursal" :options="sucursales" optionLabel="nombre" optionValue="id"
            placeholder="Filtrar por sucursal" class="w-64" showClear />

    </div>

    <!-- MODAL -->

    <Dialog v-model:visible="visible" modal header="Crear Almacen" :style="{ width: '30rem' }">

        <div class="flex flex-col gap-4">

            <div>
                <label>Nombre</label>

                <InputText class="w-full" v-model="almacen.nombre" />
            </div>

            <div>
                <label>Codigo</label>

                <InputText class="w-full" v-model="almacen.codigo" />
            </div>

            <div>
                <label>Descripcion</label>

                <InputText class="w-full" v-model="almacen.descripcion" />
            </div>

            <div>
                <label>Sucursal</label>

                <Select v-model="almacen.sucursal" :options="sucursales" optionLabel="nombre" optionValue="id"
                    placeholder="Seleccione sucursal" class="w-full" />
            </div>

        </div>

        <template #footer>

            <Button label="Cancelar" severity="secondary" @click="visible = false" />

            <Button label="Guardar" @click="funGuardarAlmacen" />

        </template>

    </Dialog>

    <!-- TABLA -->

    <DataTable :value="almacenesFiltrados" tableStyle="min-width: 60rem">

        <Column field="id" header="ID" />

        <Column field="nombre" header="Nombre" />

        <Column field="codigo" header="Codigo" />

        <Column field="descripcion" header="Descripcion" />

        <Column field="sucursal.nombre" header="Sucursal" />

        <Column header="Acciones">

            <template #body="slotProps">

                <div class="flex gap-2">

                    <Button icon="pi pi-pencil" rounded outlined @click="editarAlmacen(slotProps.data)" />

                    <Button icon="pi pi-trash" rounded outlined severity="danger"
                        @click="eliminarAlmacen(slotProps.data)" />

                </div>

            </template>

        </Column>

    </DataTable>

</template>