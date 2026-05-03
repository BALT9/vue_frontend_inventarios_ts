<script setup lang="ts">
import { onMounted, ref } from 'vue';
import usersService from '../../../services/users.service';
import type { UserInterface } from '../../../types/UserInterface';
import { Button, InputText } from 'primevue';

const users = ref<UserInterface[]>([]);

const userDataBlank = {
    username: "",
    email: "",
    password: ""
}

const user = ref<UserInterface>({ ...userDataBlank });

async function listarUsers() {
    const { data } = await usersService.index();
    users.value = data;
}

async function crearUsers() {

    try {
        if (user.value.id) {
            // modificar

            const payload: any = {
                username: user.value.username,
                email: user.value.email,
            };

            // solo enviar password si el usuario escribió uno
            if (user.value.password) {
                payload.password = user.value.password;
            }

            await usersService.update(user.value.id, payload);

            listarUsers();
            user.value = { ...userDataBlank };

        } else {
            const { data } = await usersService.store(user.value);
            console.log("data *******:", data);

            listarUsers();
            user.value = { ...userDataBlank };
        }
    } catch (error) {
        console.log(error);
    }

}

async function funEditarUser(dataUser: UserInterface) {
    console.log(JSON.stringify(dataUser, null, 2));
    user.value = dataUser;
}

async function funEliminarUser(dataUser: UserInterface) {
    if (dataUser.id) {
        const res = await usersService.delete(dataUser.id);
        console.log(res);
        listarUsers();
    }
}

onMounted(() => {
    listarUsers();
})

</script>

<template>
    <div class="max-w-6xl mx-auto p-6 space-y-10">

        <!-- TITLE -->
        <h1 class="text-3xl font-bold text-color">Users</h1>

        <!-- FORM CARD -->
        <div class="bg-surface-card shadow-lg rounded-2xl p-6">

            <form class="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div class="flex flex-col gap-2 md:col-span-2">
                    <label class="text-sm font-medium text-color">Ingrese Nombre</label>
                    <InputText class="w-full" v-model="user.username" />
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-color">Ingrese Correo</label>
                    <InputText type="email" class="w-full" v-model="user.email" />
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-color">Ingrese Contraseña</label>
                    <InputText type="password" class="w-full" v-model="user.password" />
                </div>

                <div class="md:col-span-2">
                    <Button type="button" label="Guardar Usuario" icon="pi pi-save" class="w-full"
                        @click="crearUsers()" />
                </div>

            </form>
        </div>

        <!-- DEBUG (opcional) -->
        <div class="bg-surface-100 p-4 rounded-xl text-xs overflow-auto">
            <pre>{{ user }}</pre>
        </div>

        <!-- TABLE CARD -->
        <div class="bg-surface-card shadow-lg rounded-2xl overflow-hidden">

            <table class="w-full text-sm">

                <!-- HEADER -->
                <thead class="bg-surface-100 text-color text-xs uppercase">
                    <tr>
                        <th class="p-4 text-left">ID</th>
                        <th class="p-4 text-left">Name</th>
                        <th class="p-4 text-left">Correo</th>
                        <th class="p-4 text-center">Acciones</th>
                    </tr>
                </thead>

                <!-- BODY -->
                <tbody class="divide-y divide-surface-border">

                    <tr v-for="u in users" :key="u.id" class="hover:bg-surface-50 transition">

                        <td class="p-4 font-semibold">{{ u.id }}</td>

                        <td class="p-4">{{ u.username }}</td>

                        <td class="p-4 text-color-secondary">{{ u.email }}</td>

                        <td class="p-4">
                            <div class="flex gap-2 justify-center">

                                <Button label="Editar" icon="pi pi-pencil" class="p-button-sm p-button-warning"
                                    @click="funEditarUser(u)" />

                                <Button label="Eliminar" icon="pi pi-trash" class="p-button-sm p-button-danger"
                                    @click="funEliminarUser(u)" />

                            </div>
                        </td>

                    </tr>

                </tbody>
            </table>
        </div>

        <!-- RAW JSON (debug opcional) -->
        <div class="bg-surface-100 p-4 rounded-xl text-xs overflow-auto">
            <pre>{{ JSON.stringify(users, null, 2) }}</pre>
        </div>

    </div>
</template>