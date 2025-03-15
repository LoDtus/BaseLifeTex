import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getlistUser = async (token, _id) => {
  try {
    const response = await axios.get(`${backendUrl}/projects/${_id}/members`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Data retrieved successfully:", response);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error retrieving data:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
