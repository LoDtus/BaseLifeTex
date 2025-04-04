import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createProject } from "../../../redux/projectSlice";

const AddProjectModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [managerId, setManagerId] = useState("67d23acb23793aac51e64dc5");
  const [description, setDescription] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const newProjectData = {
      name,
      managerId: { _id: managerId },
      description,
    };
    dispatch(createProject(newProjectData));
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-11/12 h-5/6 p-4 rounded-lg shadow-lg overflow-y-auto">
        {" "}
        {/* Thêm overflow-y-auto để cuộn khi cần */}
        <h2 className="text-lg font-semibold text-black text-center mb-3">
          Thêm Dự Án Mới
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          {/* Tên dự án */}
          <div>
            <label className="block text-sm font-medium text-black">
              Tên dự án
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded text-black"
              placeholder="Nhập tên dự án"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {/* Người phụ trách */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-black">
              Người phụ trách
            </label>
            <select
              className="w-full p-2 border rounded text-black bg-white"
              required
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
            >
              <option value="67d23acb23793aac51e64dc5">Quân già</option>
            </select>
          </div>

          {/* Mô tả */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-black">
              Mô tả
            </label>
            <textarea
              className="w-full p-2 border rounded text-black"
              rows="3"
              placeholder="Nhập mô tả dự án"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Nút hành động */}
          <div className="col-span-2 flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
