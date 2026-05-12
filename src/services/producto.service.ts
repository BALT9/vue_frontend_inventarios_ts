import api from './api/api';
import type { ProductoInterface } from '../types/ProductoInterface';

export default {
    async index(page=1, limit=10, buscar="") {
        return await api.get(`/producto?page=${page}&limit=${limit}&search=${buscar}`);
    },
    store(data: ProductoInterface) {
        return api.post("/producto", data);
    },
    show(id: string) {
        return api.get(`/producto/` + id);
    },
    update(id: string, data: ProductoInterface) {
        return api.patch(`/producto/` + id, data);
    },
    delete(id: string) {
        return api.delete(`/producto/` + id);
    },
    actualizaImagen(id: string, formData: FormData){
        return api.post(`/producto/${id}/actualiza-imagen`, formData);
    }
}