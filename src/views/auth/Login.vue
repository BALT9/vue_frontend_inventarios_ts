<script setup lang="ts">
import { ref, Transition } from 'vue';
import { loginNest } from '../../services/auth.service';
import { useRouter } from 'vue-router';
import { isAxiosError } from 'axios';
import { Button, Card, InputText, Password } from 'primevue';

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
        console.log("consulta ingresar", res);

        localStorage.setItem("access_token", res.data.access_token)
        router.push("/admin/perfil")

    } catch (error: unknown) {
        if (isAxiosError(error)) {
            console.log(error.response?.data);
            errors.value = error.response?.data.message;
        }
    }
}

</script>

<template>
    <!-- Contenedor con degradado sutil -->
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-green-50 p-4">

        <div class="w-full max-w-md">
            <!-- Tarjeta Principal -->
            <Card class="shadow-2xl border-none overflow-hidden rounded-2xl">
                <template #header>
                    <!-- Banner Superior Verde -->
                    <div class="h-2 bg-green-500"></div>
                </template>

                <template #title>
                    <div class="flex flex-col items-center gap-2 pt-4">
                        <div class="p-3 bg-green-100 rounded-full">
                            <i class="pi pi-lock text-2xl text-green-700"></i>
                        </div>
                        <h1 class="text-2xl font-bold text-gray-800 uppercase tracking-tight">Login</h1>
                    </div>
                </template>

                <template #content>
                    <form action="" @submit.prevent class="flex flex-col gap-5 mt-2">

                        <!-- Grupo Correo -->
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-semibold text-gray-700">Correo Electrónico</label>
                            <span class="p-input-icon-left">
                                <!-- <i class="pi pi-envelope text-green-600" /> -->
                                <InputText v-model="credenciales.email" placeholder="admin@empresa.com"
                                    class="w-full p-inputtext-lg border-gray-200 focus:border-green-500" />
                            </span>
                            <!-- Tu lógica de error de correo -->
                            <Transition name="p-message">
                                <small v-if="errors.email" class="text-red-500 font-medium flex items-center gap-1">
                                    <i class="pi pi-times-circle text-xs"></i> {{ errors.email }}
                                </small>
                            </transition>
                        </div>

                        <!-- Grupo Contraseña -->
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-semibold text-gray-700">Contraseña</label>
                            <span class="p-input-icon-left">
                                <!-- <i class="pi pi-key text-green-600" /> -->
                                <Password v-model="credenciales.password" placeholder="••••••••" :feedback="false"
                                    toggleMask inputClass="w-full p-inputtext-lg border-gray-200" class="w-full" />
                            </span>
                        </div>

                        <!-- Alerta de errores global (Tu lógica original) -->
                        <Message v-if="errors && Object.keys(errors).length > 0" severity="error" :closable="false">
                            {{ errors }}
                        </Message>

                        <!-- Botón de Ingreso -->
                        <Button type="button" @click="funIngresar()"
                            class="">
                            <span class="w-full text-center font-bold text-lg">INGRESAR</span>
                        </Button>

                    </form>
                </template>

                <template #footer>
                    <!-- Debugging: Tu lógica de visualizar el objeto -->
                    <div class="bg-gray-50 -m-6 mt-4 p-4 border-t border-gray-100 italic text-[10px] text-gray-400">
                        <span class="font-bold">Estado actual:</span> {{ credenciales }}
                    </div>
                </template>
            </Card>

            <p class="text-center mt-6 text-gray-400 text-sm">
                &copy; 2024 Tu Empresa • Panel de Gestión
            </p>
        </div>

    </div>
</template>

<style scoped>
/* Transición suave para los mensajes de error */
.p-message-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

.p-message-enter-active {
    transition: all 0.3s ease;
}

/* Forzar el color verde de PrimeVue en el foco si no tienes el tema configurado */
:deep(.p-inputtext:enabled:focus) {
    border-color: #10b981 !important;
    box-shadow: 0 0 0 0.2rem rgba(16, 185, 129, 0.2) !important;
}
</style>
