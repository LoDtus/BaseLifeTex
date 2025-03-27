import axiosInstance from "./apiService";

export const getTasks = async () => {
  const response = await axiosInstance.get("/tasks");
  return response.data;
};

export const getTasksByProject = async (projectId) => {
  const response = await axiosInstance.get(`/tasks/project/${projectId}`);
  return response.data;
};

export const updateTaskStatus = async (taskId, oldStatus, newStatus) => {
  try {
    console.log("Dữ liệu gửi đi:", { taskId, oldStatus, newStatus });
    const response = await axiosInstance.put(`/tasks/${taskId}/status`, {
      oldStatus: oldStatus,
      newStatus: newStatus,
    });
    console.log("Phản hồi từ server:", response.data);
    return response.data;
  } catch (error) {
    console.log("Cập nhật trạng thái công việc thất bại", error.response?.data || error);
    throw error;
  }
}

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

export const searchTasks = async(searchQuery) => {
  const response = await axiosInstance.get(`/tasks/search`, {
    params: { search: searchQuery }
  });
  return response.data;
};
