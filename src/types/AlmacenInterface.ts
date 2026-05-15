import type { SucursalInterface } from "./SucursalInterface";

export interface AlmacenInterface {

    id?: string;

    nombre: string;

    codigo: string;

    descripcion: string;

    sucursal?: string | SucursalInterface;
}