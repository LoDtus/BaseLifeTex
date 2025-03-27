import axiosInstance from "./apiService";

const getTasks = async () => {
  const response = await axiosInstance.get("/tasks");
  return response.data;
};

const getTasksByProject = async (projectId) => {
  const response = await axiosInstance.get(`/tasks/project/${projectId}`);
  return response.data;
};

const updateTaskStatus = async (taskId, oldStatus, newStatus) => {
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
};

const getTaskDetailById = async (id) => {
  const response = await axiosInstance.get(`/tasks/${id}`);
  return response.data;
};

const filterTask = async (idProject, data) => {
  const response = await axiosInstance.post(`/tasks/filter/${idProject}`, data);
  return response.data;
};

export const getlistUserInProjects = async (id) => {
  const response = await axiosInstance.get(`/projects/${id}/members`);
  return response;
};

export {
  getTasks,
  getTasksByProject,
  updateTaskStatus,
  getTaskDetailById,
  filterTask,
};
