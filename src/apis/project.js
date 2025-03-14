import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL_KHOA;

export const getLstProject = async (token) => {
  try {
    const response = await axios.get(`${backendUrl}/project`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Data retrieved successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error retrieving data:",
      error.response ? error.response.data : error.message
    );
  }
};
