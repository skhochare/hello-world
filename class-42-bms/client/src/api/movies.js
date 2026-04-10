import apiClient from "./index.js";

export const addMovie = async (payload) => {
    try {
        const response = await apiClient.post("/movie/add-movie", payload);
        return response.data;
    } catch (err) {
        return err.response?.data || { success: false, message: err.message };
    }
};

export const getAllMovies = async () => {
    try {
        const response = await apiClient.get("/movie/get-all-movies");
        return response.data;
    } catch (err) {
        return err.response?.data || { success: false, message: err.message };
    }
};

export const updateMovie = async (payload) => {
    try {
        const response = await apiClient.put("/movie/update-movie", payload);
        return response.data;
    } catch (err) {
        return err.response?.data || { success: false, message: err.message };
    }
};

export const deleteMovie = async (payload) => {
    try {
        const response = await apiClient.post("/movie/delete-movie", payload);
        return response.data;
    } catch (err) {
        return err.response?.data || { success: false, message: err.message };
    }
};