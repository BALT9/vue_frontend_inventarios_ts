import api from './api/api';
import type { UserInterface } from '../types/UserInterface';

export default {
    async index() {
        return await api.get(`/users`)
    },
    store(data: UserInterface) {
        return api.post("/users", data);
    },
    show(id: number) {
        return api.get(`/users` + id);
    },
    update(id: number, data: UserInterface) {
        return api.put(`/users` + id, data);
    },
    delete(id: number) {
        return api.delete(`/users` + id);
    }
}