<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getProfile } from '../../services/auth.service';
import router from '../../router';

const perfil = ref({})

onMounted(() => {
    obtenerPerfil()
})

async function obtenerPerfil() {
    const res = await getProfile();
    console.log("datos de perfil: ",res)
    perfil.value = res;
}

function cerrarSesion(){
    localStorage.removeItem("access_token")
    router.push('/login');
}

</script>

<template>
    <h1>Perfil</h1>
    <pre>{{ JSON.stringify(perfil, null, 2)}}</pre><br>
    <button type="button" @click="cerrarSesion()" >Cerrar Sesion</button>
</template>