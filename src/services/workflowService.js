import axiosInstance from "./apiService";
import { message } from "antd";
import { setWorkflowTransitions } from "@/redux/workflowSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

// Lấy chi tiết workflow theo projectId
export const getworkflowbyid = async (id) => {
  try {
    const respoonse = await axiosInstance.get(`/work-flow/${id}`);
  
    return respoonse?.data;
  } catch (error) {
    console.log(error);
  }
};
export const addworkflow = async (data) => {
  try {
    const response = await axiosInstance.post(`/work-flow`, data);
    return response.data; // response.data có workflow với _id (workflowId)
  } catch (error) {
    message.error("Không thể tạo workflow mới");
    throw error;
  }
};
// export const addworkflow = async (pro) => {
//   try {
//     const respoonse = await axiosInstance.post(`/work-flow`, pro);
//     message.success("thanh con");
//     return respoonse;
//   } catch (error) {
//     console.log(error);
//   }
// };

// Gọi và dispatch dữ liệu workflow (steps + transitions)
export const getDetailWorkFlow = (projectId) => async (dispatch) => {
  try {
    const res = await axiosInstance.get(`${baseUrl}/work-flow/${projectId}`);
    const { steps, transitions } = res.data || {};
    dispatch(setWorkflowTransitions(transitions || []));
    return { steps, transitions };
  } catch (err) {
    console.error("Fetch transitions failed", err);
    throw err;
  }
};
// trong workflowSlice.js

export const fetchWorkflowByProject = createAsyncThunk(
  "workflow/fetchWorkflowByProject",
  async ({ managerId, projectId }, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/work-flow/detail/${projectId}`);
      return res.data; // trả về toàn bộ workflow
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Lấy tất cả bước workflow theo workflowId
export const getAllWorkflowSteps = async (workflowId) => {
  try {
    const res = await axiosInstance.get(
      `${baseUrl}/work-flow/workflow-step/${workflowId}`
    );
    return res.data.data; // ✅ Trả đúng mảng steps
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Tạo bước workflow mới
export const createWorkflowStep = async (data) => {
  try {
    // data gồm: workflowId, label, stepOrder, requiredRole, isFinal
    const res = await axiosInstance.post(
      `${baseUrl}/work-flow/workflow-step`,
      data
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Cập nhật bước workflow theo workflowStepId
export const updateWorkflowStep = async (workflowStepId, data) => {
  try {
    const res = await axiosInstance.put(
      `${baseUrl}/work-flow/workflow-step/${workflowStepId}`,
      data
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Xóa bước workflow
export const deleteWorkflowStep = async (workflowStepId) => {
  try {
    const res = await axiosInstance.delete(
      `${baseUrl}/work-flow/workflow-step/${workflowStepId}`
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const deleteAllWorkflowSteps = async (workflowId) => {
  try {
    const res = await axiosInstance.delete(
      `${baseUrl}/work-flow/delete-all/workflow-step/${workflowId}`
    );

    return res.data;
  } catch (error) {
    console.error("Lỗi xoá tất cả transitions:", error);
    message.error(error.response?.data?.message || "Xoá thất bại");
    throw error.response?.data || error.message;
  }
};
// export const getWorkflowTransitions = async (workflowId) => {
//   try {
//     const response = await axiosInstance.get(
//       `/api/workflow/workflow-transition/${workflowId}`
//     );
//     return response.data.transitions; // bạn đã populate transitions trong BE
//   } catch (error) {
//     console.error("Lỗi lấy workflow transitions:", error);
//     return [];
//   }
// };
export const getWorkflowTransitionsByWorkflowId = async (workflowId) => {
  try {
    const res = await axiosInstance.get(
      `${baseUrl}/work-flow/workflow-transition/${workflowId}`
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
// Tạo transition mới
export const createWorkflowTransition = async (data) => {
  try {
    const res = await axiosInstance.post(
      `${baseUrl}/work-flow/workflow-transition`,
      data
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Cập nhật transition
export const updateWorkflowTransition = async (id, data) => {
  try {
    const res = await axiosInstance.put(
      `${baseUrl}/work-flow/workflow-transition/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Xoá transition
export const deleteWorkflowTransition = async (id) => {
  try {
    await axiosInstance.delete(
      `${baseUrl}/work-flow/workflow-transition/${id}`
    );
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
// Xoá tất cả transitions theo workflowId
export const deleteAllWorkflowTransitions = async (workflowId) => {
  try {
    const res = await axiosInstance.delete(
      `${baseUrl}/work-flow/delete-all/workflow-transition/${workflowId}`
    );
    message.success(res?.data?.message || "Xoá tất cả transition thành công");
    return res.data;
  } catch (error) {
    console.error("Lỗi xoá tất cả transitions:", error);
    message.error(error.response?.data?.message || "Xoá thất bại");
    throw error.response?.data || error.message;
  }
};