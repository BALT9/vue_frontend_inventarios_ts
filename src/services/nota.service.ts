import api from './api/api';

export default {
    async index(page = 1, limit = 10, filters: any = {}) {
        const params = new URLSearchParams();

        params.append("page", String(page));
        params.append("limit", String(limit));

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, String(value));
            }
        });

        return await api.get(`/nota?${params.toString()}`);
    },

    async reportePDF(params?: any) {
        return api.get('/nota/reporte/pdf', {
            params,
            responseType: 'blob'
        });
    },

    store(data: any) {
        return api.post("/nota", data);
    },

    show(id: string) {
        return api.get(`/nota/${id}`);
    },

    update(id: string, data: any) {
        return api.patch(`/nota/${id}`, data);
    },

    delete(id: string) {
        return api.delete(`/nota/${id}`);
    }
};