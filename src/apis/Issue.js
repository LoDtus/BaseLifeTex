import axios from "axios";
import { toolTaskStatus } from "../tools/toolsCvStatus";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const postIssueData = async (data, token) => {
  console.log(toolTaskStatus(data.status));
  
  try {
    const formData = new FormData();
    formData.append("image", data.image);
    formData.append("assigneeId", data.personName);
    formData.append("title", data.title);
    formData.append("link", data.link);
    formData.append("description", data.description);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);
    formData.append("status", toolTaskStatus(data.status));
    formData.append("projectId", data.idProject);
    formData.append(
      "assignerId",
      data.assignerId || "67d23acb23793aac51e64dc5"
    );

    const response = await axios.post(
      `${backendUrl}/tasks/create-task`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi gửi dữ liệu:", error);
    throw error;
  }
};

export const updateIssueData = async (id, data) => {
  try {
    const response = await axios.put(
      `${backendUrl}/tasks/edit-task/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
  }
};

export const getLisTaskById = async (id) => {
  try {
    const response = await axios.get(`${backendUrl}/tasks/project/${id}`);
    // console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateIssueDataStatus = async (id, data) => {
  try {
    const response = await axios.put(`${backendUrl}/tasks/${id}/status`, data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
  }
};

export const addMemberTask = async (id, data) => {
  try {
    const response = await axios.post(
      `${backendUrl}/tasks/${id}/add-user`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
  }
};
