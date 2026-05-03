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
    <h1>Users</h1>
    <div>
        <form action="">
            <label for="nom">Ingerese Nombre</label>
            <!-- <input type="text" > -->

            <InputText placeholder="Overridden" class="p-8!" v-model="user.username" />

            <br>
            <label for="correo">Ingrese Correo</label>
            <input type="email" v-model="user.email">
            <br>
            <label for="password">Ingrese Contraseña</label>
            <input type="password" v-model="user.password">
            <br>
            <button type="button" @click="crearUsers()">Guardar Usuario</button>
        </form>
        <br><br>
        <div>
            {{ user }}
        </div>

    </div>

    <table border="1">
        <thead>
            <tr>
                <td>ID</td>
                <td>NAME</td>
                <td>CORREO</td>
                <td>ACCIONES</td>
            </tr>
        </thead>
        <tbody>
            <tr v-for="u in users" :key="u.id">
                <td>{{ u.id }}</td>
                <td>{{ u.username }}</td>
                <td>{{ u.email }}</td>
                <td>
                    <button @click="funEditarUser(u)">Editar</button>
                    <button @click="funEliminarUser(u)">Eliminar</button>
                    <div class="p-5">
                        <Button label="Hola PrimeVue" icon="pi pi-check" />
                    </div>
                </td>
            </tr>
        </tbody>
    </table>

    <div>
        <pre>
            {{ JSON.stringify(users, null, 2) }}
        </pre>
    </div>
</template>