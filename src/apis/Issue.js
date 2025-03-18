import axios from "axios";
import { toolTaskStatus } from "../tools/toolsCvStatus";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const postIssueData = async (data, token) => {
  try {
    const response = await axios.post(
      `${backendUrl}/tasks/create-task`,
      {
        assigneeId: data.personName,
        title: data.title,
        link: data.link,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        image: data.image,
        status: toolTaskStatus(data.status),
        projectId: data.idProject,
        assignerId: "67d23acb23793aac51e64dc5",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.log(error);
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
