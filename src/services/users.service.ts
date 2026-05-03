import api from './api/api';
import type { UserInterface } from '../types/UserInterface';

export default {
    async index() {
        return await api.get(`/users`)
    },
    store(data: UserInterface) {
        return api.post("/users", data);
    },
    show(id: string) {
        return api.get(`/users/` + id);
    },
    update(id: string, data: UserInterface) {
        return api.patch(`/users/` + id, data);
    },
    delete(id: string) {
        return api.delete(`/users/` + id);
    }
}