import axiosInstance from "../services/apiService";

export const getLstProject = async () => {
  const response = await axiosInstance.get(`/projects`);
  return response.data;
};

export const getProjectId = async (projectId) => {
  const response = await axiosInstance.get(`/projects/${projectId}`);
  return response.data;
};
