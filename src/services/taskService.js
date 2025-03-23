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
    const response = await axiosInstance.put(`/tasks/${taskId}/status`, {
      status: status,
    });
    console.log(status);
    return response.data;
  } catch (error) {
    console.log("Cập nhật trạng thái công việc thất bại", error);
    throw error;
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

export { getTasks, getTasksByProject, updateTaskStatus, filterTask };
