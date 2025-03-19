import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getlistUser = async (token, _id) => {
  try {
    const response = await axios.get(`${backendUrl}/projects/${_id}/members`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Data listUsers successfully:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error retrieving data:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const addCommentTask = async (data) => {
  try {
    const response = await axios.post(`${backendUrl}/comments/add-comment/${data.projectId}/${data.taskId}`,data,{
    })
    return response.data;
  }
  catch(err) {
    console.log(err);
    throw err;
  }
}
