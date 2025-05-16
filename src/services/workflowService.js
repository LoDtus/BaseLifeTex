import axiosInstance from "./apiService";
import { setWorkflowTransitions } from "@/redux/workflowSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

// Lấy chi tiết workflow theo projectId
export const getWorkflowDetailByProject = (projectId) =>
  axiosInstance.get(`${baseUrl}/work-flow/${projectId}`);

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
export const fetchOrCreateWorkflow = createAsyncThunk(
  "workflow/fetchOrCreate",
  async (projectId, thunkAPI) => {
    try {
      const trimmedId = projectId.trim();
      const res = await axiosInstance.get(`/work-flow/${trimmedId}`);
      return res.data;
    } catch (err) {
      if (err.response?.status === 404) {
        // nếu chưa có workflow → tạo mới
        const managerId = thunkAPI.getState().auth.login.user._id;
        const created = await axiosInstance.post(`/work-flow`, {
          projectId: projectId.trim(),
          projectmanager: managerId,
          name: `Workflow ${projectId.trim()}`,
        });
        return created.data;
      }
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

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
