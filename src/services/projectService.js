import axiosInstance from "../services/apiService";

export const getLstProject = async () => {
  try {
    const response = await axiosInstance.get(`/projects`);
    return response.data;
  } catch (error) {
    console.error(
      "Error retrieving data:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
