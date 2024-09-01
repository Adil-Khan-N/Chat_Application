import axios from "axios";
import { HOST } from '../utils/constants.js'; // Make sure this is imported correctly

const apiClient = axios.create({
    baseURL: HOST,
});

export default apiClient;
