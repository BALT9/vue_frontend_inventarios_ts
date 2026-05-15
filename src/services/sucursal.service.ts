import api from './api/api';
import type { SucursalInterface } from '../types/SucursalInterface';

export default {
    async index() {
        return await api.get(`/sucursal`)
    },
    store(data: SucursalInterface) {
        return api.post("/sucursal", data);
    },
    show(id: string) {
        return api.get(`/sucursal/` + id);
    },
    update(id: string, data: SucursalInterface) {
        return api.patch(`/sucursal/` + id, data);
    },
    delete(id: string) {
        return api.delete(`/sucursal/` + id);
    }
}