import axios from "axios";

// Instantiate an axios client
export const client = axios.create({
    baseURL: "http://127.0.0.1:5000"
});