import axiosInstance from "../services/apiService";

export const getLstProject = async () => {
  const response = await axiosInstance.get(`/projects`);
  return response.data;
};

export const getProjectId = async (projectId) => {
  const response = await axiosInstance.get(`/projects/${projectId}`);
  return response.data;
};
export const postProjectId = async (projectId) => {
  const response = await axiosInstance.post(`/projects/${projectId}`);
  return response.data;
};

export const getMembers = async (prjId) => {
  const response = await axiosInstance.get(`/projects/${prjId}/members`);
  return response.data.data;
};
export const getTaskMembers = async (idProject) => {
  const response = await axiosInstance.get(`/projects/${idProject}/countTask`);
  return response.data;
};

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
