<script setup lang="ts">
import { ref } from 'vue';
import { loginNest } from '../../services/auth.service';
import { useRouter } from 'vue-router';
import { isAxiosError } from 'axios';

const credenciales = ref(
    {
        email: "",
        password: ""
    }
);

const errors = ref<any>({});

const router = useRouter();

async function funIngresar() {
    try {
        const res = await loginNest(credenciales.value.email, credenciales.value.password);
        console.log("consulta ingresar",res);

        localStorage.setItem("access_token", res.data.access_token)
        router.push("/admin/perfil")

    } catch (error: unknown) {
        if(isAxiosError(error)){
            console.log(error.response?.data);
            errors.value = error.response?.data.message;
        }
    }
}

</script>

<template>
    <h1>Login</h1>
    <form action="">
        <label for="">Ingrese correo</label>
        <input type="email" v-model="credenciales.email"><br>
        <!-- <small v-if="errors.email">{{ errors.email }}</small> -->

        <label for="">Ingrese contraseña</label>
        <input type="password" v-model="credenciales.password">
        <p>{{ errors }}</p>
        <br>
        <button type="button" @click="funIngresar()">Ingresar</button>
    </form>
    <p>{{ credenciales }}</p>
</template>
