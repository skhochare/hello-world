import apiClient from "./index.js";

export const addTheatre = async (payload) => {
    try {
        const response = await apiClient.post("/theatre/add-theatre", payload);
        return response.data;
    } catch (err) {
        return err.response?.data || { success: false, message: err.message };
    }
};

export const getMyTheatres = async () => {
    try {
        const response = await apiClient.get("/theatre/get-my-theatres");
        return response.data;
    } catch (err) {
        return err.response?.data || { success: false, message: err.message };
    }
};

export const getAllTheatres = async () => {
    try {
        const response = await apiClient.get("/theatre/get-all-theatres");
        return response.data;
    } catch (err) {
        return err.response?.data || { success: false, message: err.message };
    }
};

export const approveTheatre = async (payload) => {
    try {
        const response = await apiClient.put("/theatre/approve-theatre", payload);
        return response.data;
    } catch (err) {
        return err.response?.data || { success: false, message: err.message };
    }
};