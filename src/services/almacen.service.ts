import api from './api/api';
import type { AlmacenInterface } from '../types/AlmacenInterface';

export default {

    async index() {
        return await api.get(`/almacen`);
    },

    store(data: AlmacenInterface) {
        return api.post("/almacen", data);
    },

    show(id: string) {
        return api.get(`/almacen/` + id);
    },

    update(id: string, data: AlmacenInterface) {
        return api.patch(`/almacen/` + id, data);
    },

    delete(id: string) {
        return api.delete(`/almacen/` + id);
    }
}