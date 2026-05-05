<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const open = ref(false)
</script>

<template>
    <nav class="bg-white shadow-md border-b border-gray-200">

        <div class="max-w-6xl mx-auto px-4">

            <div class="flex justify-between items-center h-16">

                <!-- Logo -->
                <RouterLink to="/" class="text-2xl font-bold text-green-600">
                    MiApp
                </RouterLink>

                <!-- Desktop menu -->
                <div class="hidden md:flex space-x-8 font-medium">

                    <RouterLink to="/" class="text-gray-700 hover:text-green-600 transition"
                        active-class="text-green-600 font-semibold">
                        Inicio
                    </RouterLink>

                    <RouterLink to="/nosotros" class="text-gray-700 hover:text-green-600 transition"
                        active-class="text-green-600 font-semibold">
                        Sobre Nosotros
                    </RouterLink>

                    <RouterLink to="/servicios" class="text-gray-700 hover:text-green-600 transition"
                        active-class="text-green-600 font-semibold">
                        Servicios
                    </RouterLink>

                    <RouterLink to="/login" class="text-gray-700 hover:text-green-600 transition"
                        active-class="text-green-600 font-semibold">
                        Login
                    </RouterLink>

                </div>

                <!-- Mobile button -->
                <button class="md:hidden text-gray-700 text-2xl" @click="open = !open">
                    ☰
                </button>

            </div>
        </div>

        <!-- Mobile menu -->
        <div v-if="open" class="md:hidden px-4 pb-4 space-y-3 font-medium bg-white border-t">

            <RouterLink to="/" class="block text-gray-700 hover:text-green-600" @click="open = false">
                Inicio
            </RouterLink>

            <RouterLink to="/nosotros" class="block text-gray-700 hover:text-green-600" @click="open = false">
                Sobre Nosotros
            </RouterLink>

            <RouterLink to="/servicios" class="block text-gray-700 hover:text-green-600" @click="open = false">
                Servicios
            </RouterLink>

            <RouterLink to="/login" class="block text-gray-700 hover:text-green-600" @click="open = false">
                Login
            </RouterLink>

        </div>

    </nav>
</template>