<script setup lang="ts">
import { onMounted, ref } from 'vue';
import categoriaService from '../../../../services/categoria.service';
import type { CategoriaInterface } from '../../../../types/CategoriaInterface';
import { Button, Column, DataTable, Dialog, InputText } from 'primevue';

const categorias = ref<CategoriaInterface[]>([]);
const categoriaDataBlank = {
    nombre: "",
    descripcion: ""
}
const categoria = ref<CategoriaInterface>(categoriaDataBlank);


const visible = ref<boolean>(false);

async function listarCategorias() {
    const res = await categoriaService.index();
    console.log(res);
    categorias.value = res.data;
}

onMounted(() => {
    listarCategorias();
})

async function funGuardarCategoria() {
    try {
        if (categoria.value.id) {
            const payload: CategoriaInterface = {
                nombre: categoria.value.nombre,
                descripcion: categoria.value.descripcion
            }

            const res = await categoriaService.update(categoria.value.id, payload);
            console.log(res.data);
            // listarCategorias();
            visible.value = false;

        } else {
            const res = await categoriaService.store(categoria.value);
            console.log(res.data);
            categoria.value = { ...categoriaDataBlank };
            listarCategorias();
            visible.value = false;
        }

    } catch (error) {
        console.log(error);
    }
}

async function editarCategoria(dataCategoria: CategoriaInterface) {
    visible.value = true;
    categoria.value = dataCategoria;
}

async function eliminarCategoria(categoria: CategoriaInterface) {
    if (categoria.id) {
        await categoriaService.delete(categoria.id);
        listarCategorias();
    }
}

</script>

<template>
    <h1>categoria</h1>
    <div class="card flex justify-center">
        <Button label="Crear Categoria" @click="visible = true" />
        <Dialog v-model:visible="visible" modal header="Crear Categoria" :style="{ width: '25rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Categoria</span>
            <div class="flex items-center gap-4 mb-4">
                <label for="nombre" class="font-semibold w-24">Nombre</label>
                <InputText id="nombre" class="flex-auto" autocomplete="off" v-model="categoria.nombre" />
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="descripcion" class="font-semibold w-24">Descripcion</label>
                <InputText id="descripcion" class="flex-auto" autocomplete="off" v-model="categoria.descripcion" />
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Save" @click="funGuardarCategoria()"></Button>
            </div>
            {{ categoria }}
        </Dialog>
    </div>
    <div>
        <div class="card">
            <DataTable :value="categorias" tableStyle="min-width: 50rem">
                <Column field="id" header="id"></Column>
                <Column field="nombre" header="Nombre"></Column>
                <Column field="descripcion" header="descripcion"></Column>
                <Column :exportable="false" style="min-width: 12rem" header="Acciones">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" variant="outlined" rounded class="mr-2"
                            @click="editarCategoria(slotProps.data)" />
                        <Button icon="pi pi-trash" variant="outlined" rounded severity="danger"
                            @click="eliminarCategoria(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
    <pre>{{ JSON.stringify(categorias, null, 2) }}</pre>
</template>