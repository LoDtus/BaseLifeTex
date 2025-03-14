import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL_KHOA;

export const postIssueData = async (data, token) => {
  try {
    const response = await axios.post(
      `${backendUrl}/issues`,
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
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateIssueData = async (data, token) => {
  try {
    const response = await axios.put(
      `${backendUrl}/task/edit-tash/${data.id}`,
      {
        personName: data.personName,
        issueName: data.issueName,
        link: data.link,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        imageFile: data.imageFile,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Data posted successfully:", response.data);
  } catch (error) {
    console.error("Error posting data:", error);
  }
};
