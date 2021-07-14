import axios from "axios";

export const api = axios.create({
    baseURL: 'http://localhost:3333/episodes',
    headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
    },
});