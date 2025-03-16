import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const postIssueData = async (data, token) => {
  try {
    const response = await axios.post(
      `${backendUrl}/tasks/create-task`,
      {
        assigneeId: data.personName,
        title: data.issueName,
        link: data.link,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        images: data.imageFile,
        status: data.status,
        projectId: data.projectId,
        assignerId: "65f0b8d0fbd3a6e9f8e2c9d4",
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
    console.log("Data posted successfully:", response.data);
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
