import apiClient from "./index.js";

export const registerUser = async (payload) => {
    const response = await apiClient.post("/user/register", payload);
    return response.data;
};

export const loginUser = async (payload) => {
    const response = await apiClient.post("/user/login", payload);
    return response.data;
};