// import axios from "axios";
import axiosInstance from "../services/apiService";

export const getlistUser = async (id) => {
  const response = await axiosInstance.get(`/projects/${id}/members`);
  return response;
};
