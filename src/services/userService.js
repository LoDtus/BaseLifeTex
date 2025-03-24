import axiosInstance from "./apiService";

export const getlistUser = async (_id) => {
    const response = await axiosInstance.get(`projects/${_id}/members`);
      return response.data.data;
};