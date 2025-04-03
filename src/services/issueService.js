import { convertTaskStatus } from "@/utils/convertUtils";
import axiosInstance from "./apiService";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const postIssueData = async (data) => {
  const formData = new FormData();
  formData.append("image", data.image);
  formData.append("assigneeId", data.personName);
  formData.append("title", data.title);
  formData.append("link", data.link);
  formData.append("description", data.description);
  formData.append("startDate", data.startDate);
  formData.append("endDate", data.endDate);
  formData.append("status", +convertTaskStatus(data.status));
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
  formData.append("status", +convertTaskStatus(data.status));
  formData.append("projectId", data.projectId);
  formData.append("assignerId", data.assignerId);
  const response = await axiosInstance.put(`/tasks/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// export const updateIssueData = async (id, data) => {
//   const response = await axiosInstance.put(
//     `${backendUrl}/tasks/edit-task/${id}`,
//     data
//   );
//   return response.data;
// };

export const getLisTaskById = async (id) => {
  const response = await axiosInstance.get(`/tasks/project/${id}`);
  return response.data;
};

export const updateIssueDataStatus = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `${backendUrl}/tasks/${id}/status`,
      data,
      { headers: { "Content-Type": "application/json" } } // Quan trọng!
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi từ API:", error.response?.data || error.message);
    throw error;
  }
};


export const addMemberTask = async (id, data) => {
  const response = await axiosInstance.post(`/tasks/${id}/add-user`, data);
  return response.data;
};

export const updateIssueDataImage = async (id, data, imageFile) => {
  const formData = new FormData();

  // Append từng field vào formData
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      data[key].forEach((item) => formData.append(`${key}[]`, item));
    } else {
      formData.append(key, data[key]);
    }
  });

  // Nếu có file, append vào formData
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await axiosInstance.put(
    `${backendUrl}/tasks/edit-task/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
