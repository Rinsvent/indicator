import axios from 'axios';

const domain = process.env.NEXT_PUBLIC_BACKEND_DOMAIN || location.origin;

const API = axios.create({
    baseURL: `${domain}/v1`,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
    paramsSerializer: {indexes: null}
});

export default API;