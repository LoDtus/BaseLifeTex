import axiosInstance from "./apiService";

export const getlistUser = async (id) => {
  const response = await axiosInstance.get(`/projects/${id}/members`);
  return response.data;
};
