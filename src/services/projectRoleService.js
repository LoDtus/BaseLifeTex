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

// ==================================Roles=========================//
export const getRoleIdProject = async (idproject) => {
  try {
    const response = await axiosInstance.get(
      `/project-roles/project/${idproject}`
    );
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteProjectRoles = async (roleIds) => {
  try {
    const response = await axiosInstance.delete(`/project-roles`, {
      data: {
        roleIds, // đúng với BE
      },
    });
    return response;
  } catch (error) {
    console.error("Error deleting roles:", error);
  }
};
export const addRole = async (role) => {
  try {
    const response = await axiosInstance.post(`/project-roles`, role);
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const updateRole = async (role) => {
  try {
    const data = await axiosInstance.put(`/project-roles/${role?._id}`, role);
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const adduserRole = async (id, userIds) => {
  try {
    const response = await axiosInstance.post(`/project-roles/${id}/add-users`,userIds)
    return response;
  } catch (error) {
    console.error(error);
  }
};
export const removeuserRole = async (id, userIds) => {
  try {
    const response = await axiosInstance.delete(
      `/project-roles/${id}/remove-users`,
      {
        data: {
          userIds,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};
