import axiosInstance from "./apiService";

const getTasks = async () => {
  try {
    const response = await axiosInstance.get("/tasks");
    return response.data;
  } catch (error) {
    console.log("lấy danh sách công việc thất bại", error);
    throw error;
  }
};

const getTasksByProject = async (projectId) => {
  try {
    const response = await axiosInstance.get(`/tasks/project/${projectId}`);
    return response.data;
  } catch (error) {
    console.log("lấy danh sách công việc theo dự án thất bại", error);
    throw error;
  }
};

const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await axiosInstance.put(`/tasks/${taskId}/status`, {status});
    console.log("Status", status);
    return response.data;
  } catch (error) {
    console.log("Cập nhật trạng thái công việc thất bại", error);
    throw error;
  }
};

const getTaskDetailById = async (id) => {
  try {
    const response = await axiosInstance.get(`/tasks/${id}`);
    console.log(response)
    return response;
  } catch (error) {
    console.log(error);
  }
};

const filterTask = async (idProject, data) => {
  try {
    const response = await axiosInstance.post(
      `/tasks/filter/${idProject}`,
      data
    );

    return response.data;
  } catch (error) {
    console.log("Fillter Error: ", error);
  }
};

export const getlistUserInProjects = async (id) => {
  try {
    const response = await axiosInstance.get(`/projects/${id}/members`);
    console.log("Data listUsers successfully:", response);
    return response;
  } catch (error) {
    console.error(
      "Error retrieving data:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};


export {
  getTasks,
  getTasksByProject,
  updateTaskStatus,
  getTaskDetailById,
  filterTask,
};
