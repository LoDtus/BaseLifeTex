import axiosInstance from "./apiService";

const getTasks = async () => {
  const response = await axiosInstance.get("/tasks");
  return response.data;
};

const getTasksByProject = async (projectId) => {
  const response = await axiosInstance.get(`/tasks/project/${projectId}`);
  return response.data;
};

const updateTaskStatus = async (taskId, status) => {
  const response = await axiosInstance.put(`/tasks/${taskId}/status`, {
    status,
  });
  return response.data;
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
const deleteManyTasks = async (ids) => {
  try {
    console.log("Gửi request xóa:", ids); // Debug
    const response = await axiosInstance.delete(`/tasks/`, {
      data: { ids },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || "Lỗi khi xóa task!",
    };
  }
};
export {
  getTasks,
  getTasksByProject,
  updateTaskStatus,
  getTaskDetailById,
  filterTask,
  deleteManyTasks,
};
