import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL_KHOA;

export const postIssueData = async (data, token) => {
  try {
    const response = await axios.post(
      `${backendUrl}/issue`,
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
    console.log("Data posted successfully:", response.data);
  } catch (error) {
    console.error("Error posting data:", error);
  }
};
