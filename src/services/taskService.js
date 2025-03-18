import axios from "axios";
const API_URL = "http://192.168.11.11:5000/api/v1";

const getTaskByProject = async (id) => {
   try {
      const response = await axios.get(`${API_URL}/tasks/project/${id}`);
      return response.data
   } catch (error) {
      return console.log({
         message: "server error" + error
      });
   }
}

export { getTaskByProject }