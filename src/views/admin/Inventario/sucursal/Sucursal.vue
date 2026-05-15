<script setup lang="ts">
import { onMounted, ref } from 'vue';
import sucursalService from '../../../../services/sucursal.service';
import type { SucursalInterface } from '../../../../types/SucursalInterface';
import { Button, Column, DataTable, Dialog, InputText } from 'primevue';

const sucursales = ref<SucursalInterface[]>([]);

const sucursalDataBlank: SucursalInterface = {
    nombre: "",
    direccion: "",
    ciudad: ""
}

const sucursal = ref<SucursalInterface>({ ...sucursalDataBlank });

const visible = ref<boolean>(false);

async function funListarSucursal() {
    const res = await sucursalService.index();
    console.log(res);
    sucursales.value = res.data;
}

async function funGuardarSucursal() {
    try {
        if (sucursal.value.id) {
            const payload: SucursalInterface = {
                nombre: sucursal.value.nombre,
                direccion: sucursal.value.direccion,
                ciudad: sucursal.value.ciudad
            }

            const res = await sucursalService.update(sucursal.value.id, payload);
            console.log(res.data);
            // listarCategorias();
            visible.value = false;

        } else {
            const res = await sucursalService.store(sucursal.value);
            console.log(res);
            sucursal.value = { ...sucursalDataBlank };
            visible.value = false;
            funListarSucursal();
        }

    } catch (error) {
        console.log(error);
    }

}

function editarSucursal(dataSucursal: SucursalInterface) {
    visible.value = true;
    sucursal.value = dataSucursal;
}

async function eliminarSucursal(sucursal: SucursalInterface) {
    if (sucursal.id) {
        await sucursalService.delete(sucursal.id);
        funListarSucursal();
    }
}

onMounted(() => {
    funListarSucursal()
})


</script>

<template>
    <h1>sucursal</h1>
    <div class="card flex justify-center">
        <Button label="Crear Sucursal" @click="visible = true" />
        <Dialog v-model:visible="visible" modal header="Crear Sucursal" :style="{ width: '25rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Sucursal</span>
            <div class="flex items-center gap-4 mb-4">
                <label for="nombre" class="font-semibold w-24">Nombre</label>
                <InputText id="nombre" class="flex-auto" autocomplete="off" v-model="sucursal.nombre" />
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="descripcion" class="font-semibold w-24">Direccion</label>
                <InputText id="descripcion" class="flex-auto" autocomplete="off" v-model="sucursal.direccion" />
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="ciudad" class="font-semibold w-24">Ciudad</label>
                <InputText id="ciudad" class="flex-auto" autocomplete="off" v-model="sucursal.ciudad" />
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Save" @click="funGuardarSucursal()"></Button>
            </div>
            {{ sucursal }}
        </Dialog>
    </div>

    <div class="card">
        <DataTable :value="sucursales" tableStyle="min-width: 50rem">
            <Column field="id" header="id"></Column>
            <Column field="nombre" header="Nombre"></Column>
            <Column field="direccion" header="Direccion"></Column>
            <Column field="ciudad" header="Ciudad"></Column>
            <Column :exportable="false" style="min-width: 12rem" header="Acciones">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" variant="outlined" rounded class="mr-2"
                        @click="editarSucursal(slotProps.data)" />
                    <Button icon="pi pi-trash" variant="outlined" rounded severity="danger"
                        @click="eliminarSucursal(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>

    <pre>
    {{ JSON.stringify(sucursales, null, 2) }}
</pre>
</template>