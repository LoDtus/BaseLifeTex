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
export const deleteTaskById = async (taskId) => {
  try {
    const response = await axiosInstance.delete(`/tasks/${taskId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Lỗi xoá task:", error.response || error);
    return {
      success: false,
      error: error.response?.data || "Lỗi khi xóa task!",
    };
  }
};
export const searchTasks = async (searchQuery, projectId) => {
  const response = await axiosInstance.get(
    `/tasks/search/${projectId}?search=${searchQuery}`
  );
  return response.data;
};

export const getTaskByPagination = async (projectId, page, limit) => {
  const response = await axiosInstance.get(
    `/tasks/project/${projectId}?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const addTask = async (data) => {
  const formData = new FormData();
  formData.append("image", data.image);
  formData.append("assigneeId", data.assigneeId);
  formData.append("title", data.title);
  formData.append("link", data.link);
  formData.append("description", data.description);
  formData.append("startDate", data.startDate);
  formData.append("endDate", data.endDate);
  formData.append("status", data.status);
  formData.append("projectId", data.projectId);
  formData.append("assignerId", data.assignerId);
  formData.append("priority", data.priority);
  formData.append("type", data.type);

  const response = await axiosInstance.post(`/tasks`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateTask = async (id, data) => {
  const formData = new FormData();
  data.image && formData.append("image", data.image);
  formData.append("assigneeId", data.assigneeId);
  formData.append("title", data.title);
  formData.append("link", data.link);
  formData.append("description", data.description);
  formData.append("startDate", data.startDate);
  formData.append("endDate", data.endDate);
  formData.append("status", data.status);
  formData.append("projectId", data.projectId);
  formData.append("assignerId", data.assignerId);
  formData.append("priority", data.priority);
  // formData.append("type", data.type); // Be chưa cho cập nhật type

  const response = await axiosInstance.put(`/tasks/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
