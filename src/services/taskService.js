import axiosInstance from "./apiService";

export const getTasks = async () => {
  const response = await axiosInstance.get("/tasks");
  return response.data;
};

export const getTasksByProject = async (projectId) => {
  const response = await axiosInstance.get(`/tasks/project/${projectId}`);
  return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await axiosInstance.put(`/tasks/${taskId}/status`, {
    status,
  });
  return response.data;
};

export const getTaskDetailById = async (id) => {
  const response = await axiosInstance.get(`/tasks/${id}`);
  return response.data;
};

export const filterTask = async (idProject, data) => {
  const response = await axiosInstance.post(`/tasks/filter/${idProject}`, data);
  return response.data;
};

export const getlistUserInProjects = async (id) => {
  const response = await axiosInstance.get(`/projects/${id}/members`);
  return response;
};




