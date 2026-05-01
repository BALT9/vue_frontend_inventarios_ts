<script setup lang="ts">
import { ref } from 'vue';

const credenciales = ref(
    {
        email: "",
        password: ""
    }
);

function funIngresar(){
    alert("datos")
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

