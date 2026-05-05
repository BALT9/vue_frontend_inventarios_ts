import api from './api/api';
import type { CategoriaInterface } from '../types/CategoriaInterface';

export default {
    async index() {
        return await api.get(`/categoria`)
    },
    store(data: CategoriaInterface) {
        return api.post("/categoria", data);
    },
    show(id: string) {
        return api.get(`/categoria/` + id);
    },
    update(id: string, data: CategoriaInterface) {
        return api.patch(`/categoria/` + id, data);
    },
    delete(id: string) {
        return api.delete(`/categoria/` + id);
    }
}