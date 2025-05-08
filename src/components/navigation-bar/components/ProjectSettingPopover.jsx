import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Button, Input, Checkbox, Dropdown, Menu } from "antd";
const ProjectSettingPopover = ({ onClose }) => {
  const popoverRef = useRef(null);
  const [activeTab, setActiveTab] = useState("workflow");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose(); // click ngoài thì đóng
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999]">
      <div
        ref={popoverRef}
        className="bg-white shadow-lg flex rounded-xl w-[1100px] h-[600px] overflow-y-auto border"
      >
        <div className="bg-[#e6e6e6] w-[30%]  flex flex-col items-center py-4 gap-6 font-bold ">
          <h1>WORK FLOW</h1>
          <button
            onClick={() => setActiveTab("workflow")}
            className={`w-48 py-2 border rounded transition ${
              activeTab === "workflow"
                ? "border-blue-500 bg-blue-100"
                : "border-gray-400 hover:border-blue-500 hover:bg-blue-50"
            }`}
          >
            Quản lý luồng
          </button>
          <button
            onClick={() => setActiveTab("roles")}
            className={`w-48 py-2 border rounded transition ${
              activeTab === "roles"
                ? "border-gray-500 bg-gray-100"
                : "border-gray-400 hover:border-gray-500 hover:bg-gray-100"
            }`}
          >
            Quản lý vai trò
          </button>
        </div>
        <div className="w-[70%] h-[100%] flex flex-col items-center ">
          {activeTab === "workflow" && (
            <div className="flex w-full h-full">
              {/* Cột trái - 30% */}
              <div className="w-[30%] border-r pr-4 pt-4">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  TRẠNG THÁI
                </h3>
                <ul className="list-disc pl-5 text-sm">
                  <li className="flex items-center justify-between mb-2">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Draft
                    </span>
                    <div className="flex ">
                      <Button
                        icon={<DeleteOutlined />}
                        className="text-red-500 hover:text-red-700"
                        type="link"
                      />
                      <Button
                        icon={<EditOutlined />}
                        className="text-blue-500 hover:text-blue-700"
                        type="link"
                      />
                    </div>
                  </li>
                  <li className="flex items-center justify-between mb-2">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      In Review
                    </span>
                    <div className="flex ">
                      <Button
                        icon={<DeleteOutlined />}
                        className="text-red-500 hover:text-red-700"
                        type="link"
                      />
                      <Button
                        icon={<EditOutlined />}
                        className="text-blue-500 hover:text-blue-700"
                        type="link"
                      />
                    </div>
                  </li>
                  <li className="flex items-center justify-between mb-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      Approved
                    </span>
                    <div className="flex ">
                      <Button
                        icon={<DeleteOutlined />}
                        className="text-red-500 hover:text-red-700"
                        type="link"
                      />
                      <Button
                        icon={<EditOutlined />}
                        className="text-blue-500 hover:text-blue-700"
                        type="link"
                      />
                    </div>
                  </li>
                  <li className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Done
                    </span>
                    <div className="flex ">
                      <Button
                        icon={<DeleteOutlined />}
                        className="text-red-500 hover:text-red-700"
                        type="link"
                      />
                      <Button
                        icon={<EditOutlined />}
                        className="text-blue-500 hover:text-blue-700"
                        type="link"
                      />
                    </div>
                  </li>
                  <li className="flex items-center justify-between mb-2">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      Archived
                    </span>
                    <div className="flex ">
                      <Button
                        icon={<DeleteOutlined />}
                        className="text-red-500 hover:text-red-700"
                        type="link"
                      />
                      <Button
                        icon={<EditOutlined />}
                        className="text-blue-500 hover:text-blue-700"
                        type="link"
                      />
                    </div>
                  </li>
                </ul>
                <div className="flex justify-center mt-4">
                  <button className="flex items-center gap-1 border border-gray-400 rounded px-3 py-1 hover:border-green-500 hover:bg-green-100 transition">
                    <PlusOutlined />
                    Thêm trạng thái
                  </button>
                </div>
              </div>

              {/* Cột phải - 70% */}
              <div className="w-[70%] pl-6 pt-4">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  ROLES
                </h3>
                <div className="flex justify-center gap-6 flex-wrap">
                  <label className="flex items-center">
                    <input type="checkbox" />
                    ADMIN
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    PM
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    DEV
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    TEST
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    BA
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    USER
                  </label>
                </div>
                <div className="flex flex-col gap-4 ml-6">
                  <div className="flex flex-col items-start mt-3">
                    <label className="font-medium">Từ trạng thái:</label>
                    <input
                      type="text"
                      className="border px-2 py-1 rounded w-full"
                      placeholder="Ví dụ: Draft"
                    />
                  </div>

                  <div className="flex flex-col items-start">
                    <label className="font-medium">đến trạng thái:</label>
                    <input
                      type="text"
                      className="border px-2 py-1 rounded w-full"
                      placeholder="Ví dụ: Done"
                    />
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  <button className="flex items-center gap-1 border border-gray-400 rounded px-3 py-1 hover:border-blue-500 hover:bg-blue-500 transition">
                    Thêm luồng
                  </button>
                </div>
                <div>Các luồng đã tạo: </div>
              </div>
            </div>
          )}

          {activeTab === "roles" && (
            <div className="w-full px-6">
              <h2 className="text-lg font-semibold pt-4 mb-4 text-center">
                QUẢN LÝ VAI TRÒ
              </h2>

              <div className="flex justify-center items-center gap-4">
                <Input placeholder="Chọn vai trò" readOnly className="!w-60" />
              </div>

              {/* Dòng này sẽ nằm sát trái */}
              <div className="w-full pl-6 mt-4 ">
                <div className="text-left font-medium">DANH SÁCH TEST</div>
                <div className="mt-4 flex items-center gap-4 justify-between">
                  <Input
                    placeholder="Tìm kiếm vai trò..."
                    className="!w-64"
                    allowClear
                  />
                  <button className=" bg-yellow-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                    chức năng
                  </button>
                </div>
                <div className=" mt-4 flex items-center justify-between">
                  <button className="flex items-center gap-1 border border-gray-400 rounded px-3 py-1 hover:border-green-500 hover:bg-green-100 transition">
                    <PlusOutlined />
                    Thêm người
                  </button>
                  <button className="text-lg text-red-500 hover:text-red-700">
                    <DeleteOutlined />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProjectSettingPopover;
