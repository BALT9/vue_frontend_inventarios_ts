export interface ProductoInterface {
    id?: string;
    nombre: string;
    descripcion?: string;
    unidad_medida?: string;
    marca?: string;
    precio_venta_actual?: string;
    imagen?: string;
    estado?: boolean;

    categoria: number; // 👈 correcto
}