<script setup lang="ts">
import { ref } from 'vue';
import { loginNest } from '../../services/auth.service';
import { useRouter } from 'vue-router';

const credenciales = ref(
    {
        email: "",
        password: ""
    }
);

const router = useRouter();

async function funIngresar() {
    try {
        const res = await loginNest(credenciales.value.email, credenciales.value.password);
        console.log(res);

        localStorage.setItem("access_token", res.access_token)
        router.push("/admin/perfil")

    } catch (error) {
        console.log(error);
    }
}

</script>

<template>
    <h1>Login</h1>
    <form action="">
        <label for="">Ingrese correo</label>
        <input type="email" v-model="credenciales.email"><br>

        <label for="">Ingrese contraseña</label>
        <input type="password" v-model="credenciales.password">
        <br>
        <button type="button" @click="funIngresar()">Ingresar</button>
    </form>
    <p>{{ credenciales }}</p>
</template>
