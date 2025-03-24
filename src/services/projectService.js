import axiosInstance from "./apiService";

export const getLstProject = async () => {
    const response = await axiosInstance.get('/projects');
    return response.data.data;
};


