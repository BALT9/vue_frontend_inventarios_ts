import api from './api/api';
import type { ClienteInterface } from '../types/Cliente-ProovedorInterface';

export default {
    async index() {
        return await api.get(`/cliente-proveedor`)
    },
    store(data: ClienteInterface) {
        return api.post("/cliente-proveedor", data);
    },
    show(id: string) {
        return api.get(`/cliente-proveedor/` + id);
    },
    update(id: string, data: ClienteInterface) {
        return api.patch(`/cliente-proveedor/` + id, data);
    },
    delete(id: string) {
        return api.delete(`/cliente-proveedor/` + id);
    }
}