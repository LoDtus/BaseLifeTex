import axiosInstance from "../services/apiService";

export const getLstProject = async () => {
  const response = await axiosInstance.get(`/projects`);
  return response.data;
};

export const getProjectId = async (projectId) => {
  const response = await axiosInstance.get(`/projects/${projectId}`);
  return response.data;
};

export const getMembers = async (prjId) => {
  const response = await axiosInstance.get(`/projects/${prjId}/members`);
  return response.data.data;
}

export const searchProjects = async (searchQuery, projectId) => {
  const response = await axiosInstance.get(`/projects/search`, {
    params: { search: searchQuery, projectId },
  });
  return response.data;
};

export const deleteProjectById = async (projectId) => {
  const response = await axiosInstance.delete(`/projects/${projectId}`);
  return response.data;
};

export const countTasks = async (projectId) => {
  const response = await axiosInstance.get(`/projects/${projectId}/countTask`);
  return response.data;
};