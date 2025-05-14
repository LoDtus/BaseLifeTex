import axiosInstance from "./apiService";

export const getWorkflowDetailByProject = (projectId) =>
  axiosInstance.get(`/api/workflows/${projectId}`);
