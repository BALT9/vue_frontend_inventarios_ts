<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getProfile } from '../../services/auth.service';
import router from '../../router';

import Card from 'primevue/card';
import Button from 'primevue/button';

const perfil = ref<any>({})

onMounted(() => {
    obtenerPerfil()
})

async function obtenerPerfil() {
    const res = await getProfile();
    console.log("datos de perfil: ", res)
    perfil.value = res;
}

function cerrarSesion() {
    localStorage.removeItem("access_token")
    router.push('/login');
}
</script>

<template>
    <div class="max-w-2xl mx-auto mt-10">

        <Card class="shadow-xl rounded-2xl">

            <template #title>
                <div class="flex items-center gap-2">
                    <i class="pi pi-user text-xl"></i>
                    <span class="text-lg font-semibold">Mi Perfil</span>
                </div>
            </template>

            <template #content>
                <div class="space-y-3 text-sm">

                    <div>
                        <span class="font-semibold">Nombre:</span>
                        <span class="ml-2">{{ perfil?.username }}</span>
                    </div>

                    <div>
                        <span class="font-semibold">Email:</span>
                        <span class="ml-2">{{ perfil?.email }}</span>
                    </div>

                    <div>
                        <span class="font-semibold">ID:</span>
                        <span class="ml-2">{{ perfil?.id }}</span>
                    </div>

                </div>

                <div class="mt-6 flex justify-end">
                    <Button label="Cerrar sesión" icon="pi pi-sign-out" severity="danger" @click="cerrarSesion" />
                </div>
            </template>

        </Card>

        <pre class="mt-6 text-xs bg-gray-100 p-3 rounded">
    {{ JSON.stringify(perfil, null, 2) }}
</pre>

    </div>
</template>