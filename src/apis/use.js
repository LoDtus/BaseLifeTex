// import axios from "axios";
import axiosInstance from "../services/apiService";

export const getlistUser = async (id) => {
  try {
    const response = await axiosInstance.get(`/projects/${id}/members`);
    console.log("Data listUsers successfully:", response);
    return response;
  } catch (error) {
    console.error(
      "Error retrieving data:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
