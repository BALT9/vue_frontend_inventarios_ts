<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import notaService from '../../../../services/nota.service';
import productoService from '../../../../services/producto.service';

import { Column, DataTable, Dropdown } from 'primevue';

// ======================
// DATA
// ======================
const movimientos = ref<any[]>([]);
const cargando = ref(false);

// filtros
const filtroProducto = ref<number | null>(null);
const filtroTipo = ref<string | null>(null);
const filtroFecha = ref<string | null>(null);

// opciones
const productos = ref<any[]>([]);

// ======================
// LISTAR DATOS
// ======================
async function listarMovimientos() {
    cargando.value = true;

    const res = await notaService.index(1, 200, {});

    movimientos.value = res.data.data.flatMap((nota: any) =>
        nota.movimientos.map((mov: any) => ({
            ...mov,
            nota: {
                id: nota.id,
                fecha: nota.fecha,
                tipo_nota: nota.tipo_nota,
                estado_nota: nota.estado_nota,
                observaciones: nota.observaciones
            },
            cliente: nota.cliente ?? null,
            user: nota.user ?? null
        }))
    );

    cargando.value = false;
}

// ======================
// FILTROS DATA
// ======================
async function cargarFiltros() {
    const prod = await productoService.index(1, 100, '');
    productos.value = prod.data.data;
}

// ======================
// COMPUTED FILTRADO
// ======================
const movimientosFiltrados = computed(() => {
    return movimientos.value
        .filter((m) => {
            const matchProducto =
                !filtroProducto.value || m.producto?.id === filtroProducto.value;

            const matchTipo =
                !filtroTipo.value || m.tipo_movimiento === filtroTipo.value;

            const matchFecha =
                !filtroFecha.value ||
                new Date(m.nota?.fecha).toISOString().slice(0, 10) === filtroFecha.value;

            return matchProducto && matchTipo && matchFecha;
        })
        .sort((a, b) => b.nota.id - a.nota.id);
});

// ======================
// RESET FILTROS
// ======================
function resetFiltros() {
    filtroProducto.value = null;
    filtroTipo.value = null;
    filtroFecha.value = null;
}

async function descargarFactura(notaId: number) {
    
}

// ======================
// INIT
// ======================
onMounted(() => {
    listarMovimientos();
    cargarFiltros();
});
</script>

<template>
    <div class="p-4 bg-white rounded-lg">

        <h2 class="text-xl font-bold mb-4">
            Movimientos de Inventario
        </h2>

        <!-- 🔎 FILTROS -->
        <div class="flex gap-2 mb-4 flex-wrap">

            <Dropdown v-model="filtroProducto" :options="productos" optionLabel="nombre" optionValue="id"
                placeholder="Producto" showClear class="w-52" />

            <Dropdown v-model="filtroTipo" :options="['ingreso', 'salida', 'devolucion']" placeholder="Tipo" showClear
                class="w-40" />

            <input type="date" v-model="filtroFecha" class="border p-2 rounded" />

            <button class="bg-gray-200 px-3 rounded" @click="resetFiltros">
                Reset
            </button>

            <button class="bg-green-500 px-3 rounded" @click="">
                Generar Reporte
            </button>

        </div>

        <!-- 📦 TABLA -->
        <DataTable :value="movimientosFiltrados" :loading="cargando" paginator :rows="10" tableStyle="min-width: 60rem">

            <!-- FECHA -->
            <Column header="Fecha">
                <template #body="{ data }">
                    {{ new Date(data.nota?.fecha).toLocaleString() }}
                </template>
            </Column>

            <!-- PRODUCTO -->
            <Column header="Producto">
                <template #body="{ data }">
                    {{ data.producto?.nombre }}
                </template>
            </Column>

            <!-- CANTIDAD -->
            <Column field="cantidad" header="Cantidad" />

            <!-- TIPO -->
            <Column field="tipo_movimiento" header="Tipo" />

            <!-- PRECIO -->
            <Column header="Precio Venta">
                <template #body="{ data }">
                    {{ data.precio_unitario_venta }}
                </template>
            </Column>

            <!-- CLIENTE -->
            <Column header="Cliente">
                <template #body="{ data }">
                    {{ data.cliente?.razon_social || '-' }}
                </template>
            </Column>

            <!-- NOTA -->
            <Column header="Nota #">
                <template #body="{ data }">
                    {{ data.nota?.id }}
                </template>
            </Column>

            <!-- ESTADO -->
            <Column header="Factura">
                <template #body="{ data }">
                    <i class="pi pi-download text-blue-600 cursor-pointer hover:text-blue-800"
                        @click="descargarFactura(data.nota?.id)" title="Descargar factura"></i>
                </template>
            </Column>

        </DataTable>

    </div>
</template>