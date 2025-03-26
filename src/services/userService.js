import axiosInstance from "./apiService";

export const getlistUser = async (id) => {
   try {
     const response = await axiosInstance.get(`/projects/${id}/members`);
     return response.data;
   } catch (error) {
     console.error(
       "Error retrieving data:",
       error.response ? error.response.data : error.message
     );
     throw error;
   }
 };
