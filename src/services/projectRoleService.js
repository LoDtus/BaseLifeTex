import axiosInstance from "./apiService";

export const getById = async (id) => {
  try {
    const response = await axiosInstance.get(`/project-roles/project/${id}`);
    console.log("Dữ liệu từ API:", response?.data);
    return response?.data;
  } catch (error) {
    console.log("lỗi server", error);
  }
};

export const createRole = async(user)=>{
  try {
    const response = await axiosInstance.post(`/project-roles/batch`,user)
    return response
  } catch (error) {
    console.log(error);
  }
}

export const RemoveRole = async (ProjectId, userId) => {
  try {
    const response = await axiosInstance.delete(
      `/project-roles/project/${ProjectId}/user/${userId}/role`
    );
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteRoles = async (projectId, userIds, role) => {
  try {
    const response = await axiosInstance.delete(
      `/project-roles/project/${projectId}/users/role`,
      {
        data: {
          userIds,
          role,
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.error(error);
  }
};