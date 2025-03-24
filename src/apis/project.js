// import axios from "axios";
import axiosInstance from "../services/apiService";
export const getLstProject = async () => {
  try {
    console.log(axiosInstance);

    const response = await axiosInstance.get("/projects");
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
