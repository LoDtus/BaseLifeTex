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
    const response = await axiosInstance.put(`/tasks/${taskId}/status`, {
      oldStatus: oldStatus,
      newStatus: newStatus,
    });
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(
      "Cập nhật trạng thái công việc thất bại",
      error.response?.data || error
    );
    throw error;
  }
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

export const deleteManyTasks = async (ids) => {
  try {
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

export const searchTasks = async (searchQuery, projectId) => {
  const response = await axiosInstance.get(`/tasks/search`, {
    params: { search: searchQuery, projectId },
  });
  return response.data;
};

export const getTaskByPagination = async (projectId, page, pageSize) => {
  const response = await axiosInstance.get(
    `/tasks/project/${projectId}?page=${page}&limit=${pageSize}`
  );
  return response.data;
};
