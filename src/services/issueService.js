import { toolTaskStatus } from "../tools/toolsCvStatus";
import axiosInstance from "./apiService";

export const postIssueData = async (data) => {
  const formData = new FormData();
  formData.append("image", data.image);
  formData.append("assigneeId", data.personName);
  formData.append("title", data.title);
  formData.append("link", data.link);
  formData.append("description", data.description);
  formData.append("startDate", data.startDate);
  formData.append("endDate", data.endDate);
  formData.append("status", +toolTaskStatus(data.status));
  formData.append("projectId", data.idProject);
  formData.append("assignerId", data.assignerId);

  const response = await axiosInstance.post(`/tasks`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateIssueData = async (id, data) => {
  const formData = new FormData();
  data.image && formData.append("image", data.image);
  formData.append("assigneeId", data.assigneeId);
  formData.append("title", data.title);
  formData.append("link", data.link);
  formData.append("description", data.description);
  formData.append("startDate", data.startDate);
  formData.append("endDate", data.endDate);
  formData.append("status", +toolTaskStatus(data.status));
  formData.append("projectId", data.projectId);
  formData.append("assignerId", data.assignerId);
  const response = await axiosInstance.put(`/tasks/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
