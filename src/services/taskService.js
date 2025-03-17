import axiosInstance from "./apiService"

const getTasks = async () => {
    try {
        const response = await axiosInstance.get("/tasks");
        return response.data;
    } catch (error) {
        console.log("lấy danh sách công việc thất bại", error);
        throw error;
    }
}

const getTasksByProject = async (projectId) => {
    try {
        const response = await axiosInstance.get(`/tasks/project/${projectId}`);
        return response.data;
    } catch (error) {
        console.log("lấy danh sách công việc theo dự án thất bại", error);
        throw error;
    }
}

const updateTaskStatus = async (taskId, status) => {
    try {
        const response = await axiosInstance.put(`/tasks/${taskId}/status`, { status: status });        
        return response.data;
    } catch (error) {
        console.log("Cập nhật trạng thái công việc thất bại", error);
        throw error;
    }
}

export { getTasks, getTasksByProject, updateTaskStatus }