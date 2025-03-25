import axiosInstance from "../services/apiService";

// const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getLstProject = async () => {
  try {
    const response = await axiosInstance.get(`/projects`);
    // console.log("Data retrieved successfully:", response.data);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error retrieving data:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
