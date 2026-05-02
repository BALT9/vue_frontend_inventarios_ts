<script setup lang="ts">
import { onMounted, ref } from 'vue';
import usersService from '../../../services/users.service';
import type { UserInterface } from '../../../types/UserInterface';

const users = ref<UserInterface[]>([]);

const userDataBlank = {
    username: "",
    email: "",
    password: ""
}

const user = ref<UserInterface>({...userDataBlank});

async function listarUsers() {
    const { data } = await usersService.index();
    users.value = data;
}

async function crearUsers() {
    const { data } = await usersService.store(user.value);
    console.log("data *******:", data)
    listarUsers();
    user.value = {...userDataBlank};
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
            <input type="text" v-model="user.username">
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
            <tr v-for="u in users">
                <td>{{ u.id }}</td>
                <td>{{ u.username }}</td>
                <td>{{ u.email }}</td>
                <td>
                    <button>Editar</button>
                    <button>Eliminar</button>
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