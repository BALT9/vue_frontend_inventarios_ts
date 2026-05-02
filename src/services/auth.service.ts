import api from './api/api';

// Funcion Login
export async function loginNest(email:string, password: string) {
    const res = await api.post("/auth/login", {email, password});
    return res;
}

export async function getProfile() {
    const res = await api.get("/auth/profile");
    return res.data;
}