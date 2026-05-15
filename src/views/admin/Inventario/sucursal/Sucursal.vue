<script setup lang="ts">
import { onMounted, ref } from 'vue';
import sucursalService from '../../../../services/sucursal.service';
import type { SucursalInterface } from '../../../../types/SucursalInterface';
import { Button, Dialog, InputText } from 'primevue';

const sucursales = ref<SucursalInterface[]>([]);

const sucursalDataBlank : SucursalInterface = {
    nombre: "",
    direccion: "",
    ciudad: ""
}

const sucursal = ref<SucursalInterface>({...sucursalDataBlank});

const visible = ref<boolean>(false);

async function funListarSucursal() {
    const res = await sucursalService.index();
    console.log(res);
    sucursales.value = res.data;
}

async function funGuardarSucursal() {
    const res = await sucursalService.store(sucursal.value);
    console.log(res);
    sucursal.value = { ...sucursalDataBlank };
    visible.value = false;
    funListarSucursal();
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

    <pre>
        {{ JSON.stringify(sucursales, null, 2) }}
    </pre>
</template>