import axios from 'axios';

const SUBTE_CLIENT_ID = process.env.SUBTE_CLIENT_ID || "";
const SUBTE_CLIENT_SECRET = process.env.SUBTE_CLIENT_SECRET || "";

const transportApi = axios.create({
    baseURL: 'https://apitransporte.buenosaires.gob.ar',
});

export { transportApi, SUBTE_CLIENT_ID, SUBTE_CLIENT_SECRET };
