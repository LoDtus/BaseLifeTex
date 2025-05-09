import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Table, Popconfirm, message, Modal } from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  DownOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";
import { Button, Input, Checkbox, Dropdown, Menu } from "antd";
const ProjectSettingPopover = ({ onClose }) => {
  const popoverRef = useRef(null);
  const [activeTab, setActiveTab] = useState("workflow");
  const [users, setUsers] = useState([]);
  const [openFunction, setOpenFunction] = useState(false);
  //state quản lý luồng
  const [fromState, setFromState] = useState("");
  const [toState, setToState] = useState("");
  const [flows, setFlows] = useState([]);

  const permissions = ["view", "Add", "Edit", "Delete", "Comment", "Drag"];
  const roles = [
    {
      role: "PM",
      rights: [1, 1, 1, 1, 0, 1],
    },
    {
      role: "Dev",
      rights: [1, 0, 0, 0, 1, 1],
    },
    {
      role: "Test",
      rights: [1, 0, 0, 0, 1, 1],
    },
    {
      role: "BA",
      rights: [1, 0, 0, 0, 1, 1],
    },
    {
      role: "User",
      rights: [1, 0, 0, 0, 1, 1],
    },
  ];
  const handleAddUser = () => {
    const fakeUser = {
      key: Date.now(),
      userName: `User ${users.length + 1}`,
      email: `user${users.length + 1}@example.com`,
    };
    setUsers((prev) => [...prev, fakeUser]);
    message.success("Đã thêm người");
  };

  // Xóa người
  const handleDeleteUser = (key) => {
    setUsers((prev) => prev.filter((u) => u.key !== key));
    message.success("Đã xóa người dùng");
  };

  const userColumns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Xóa",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDeleteUser(record.key)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button danger size="small">
            Xóa
          </Button>
        </Popconfirm>
      ),
      width: 80,
    },
  ];
  const handleAddFlow = () => {
    if (!fromState || !toState) return;

    setFlows([...flows, { from: fromState, to: toState }]);
    setFromState("");
    setToState("");
  };
  const handleDelete = (index) => {
    setFlows(flows.filter((_, i) => i !== index));
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Nếu có modal đang mở và click nằm trong modal => bỏ qua
      const modalNode = document.querySelector(".ant-modal");
      if (
        modalNode &&
        (modalNode === event.target || modalNode.contains(event.target))
      ) {
        return;
      }

      // Nếu click ngoài popover thì đóng popover
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div
        ref={popoverRef}
        className="bg-white shadow-lg flex rounded-xl w-full max-w-screen-lg h-[600px] overflow-y-auto border p-6 mx-auto"
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
              <div className="w-[70%] pl-6 pr-6 pt-4">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  ROLES
                </h3>
                <div className="flex justify-center gap-6 flex-wrap text-sm">
                  {["ADMIN", "PM", "DEV", "TEST", "BA", "USER"].map((role) => (
                    <label key={role} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="userRole"
                        value={role}
                        className="accent-blue-500"
                      />
                      <span>{role}</span>
                    </label>
                  ))}
                </div>
                <div className="flex flex-col gap-4 pl-6 pr-6 pt-4">
                  <div className="flex flex-col items-start mt-3">
                    <label className="font-medium">Từ trạng thái:</label>
                    <input
                      type="text"
                      className="border px-2 py-1 rounded w-full"
                      placeholder="Ví dụ: Draft"
                      value={fromState}
                      onChange={(e) => setFromState(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col items-start">
                    <label className="font-medium">đến trạng thái:</label>
                    <input
                      type="text"
                      className="border px-2 py-1 rounded w-full"
                      placeholder="Ví dụ: Done"
                      value={toState}
                      onChange={(e) => setToState(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleAddFlow}
                    className="flex items-center gap-1 border border-gray-400 rounded px-3 py-1 hover:border-blue-500 hover:bg-blue-500 transition"
                  >
                    Thêm luồng
                  </button>
                </div>
                <div className="mt-2  pt-1">
                  <h5 className="font-semibold mb-2">Các luồng đã tạo:</h5>
                  {flows.length === 0 ? (
                    <p className="text-gray-500">Chưa có luồng nào được tạo.</p>
                  ) : (
                    <ul className="list-disc pl-3 space-y-1 ">
                      {flows.map((flow, index) => (
                        <li className="flex justify-between items-center border p-2 rounded gap-2">
                          <span className="flex-1">
                            {flow.from} ➝ {flow.to}
                          </span>
                          <button
                            onClick={() => handleDelete(index)}
                            className="text-red-500 hover:underline ml-4"
                          >
                            🗑 Xóa
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
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
              <div className="w-full mt-4 px-8 ">
                <div className="text-left font-medium ">DANH SÁCH TEST</div>

                <div className="mt-4 flex items-center gap-4 justify-between ">
                  <Input
                    placeholder="Tìm kiếm vai trò..."
                    className="!w-64"
                    allowClear
                  />
                  <button
                    onClick={() => setOpenFunction(true)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    chức năng
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={handleAddUser}
                    className="flex items-center gap-1 border border-gray-400 rounded px-3 py-1 hover:border-green-500 hover:bg-green-100 transition"
                  >
                    <PlusOutlined />
                    Thêm người
                  </button>
                  <button className="text-lg text-red-500 hover:text-white border border-transparent hover:border-red-500 hover:bg-red-500 rounded px-2 py-1 transition-all duration-200">
                    <DeleteOutlined />
                  </button>
                </div>

                <div className="mt-4">
                  <Table
                    dataSource={users}
                    columns={userColumns}
                    pagination={false}
                    size="small"
                    bordered
                  />
                </div>
              </div>
            </div>
          )}
          <Modal
            title="Ma trận phân quyền theo vai trò"
            open={openFunction}
            onCancel={() => setOpenFunction(false)}
            footer={null}
            width={800}
          >
            <div className="overflow-auto">
              <table className="table-auto border-collapse w-full text-center">
                <thead>
                  <tr>
                    <th className="border px-4 py-2 bg-gray-100">
                      Quyền / Vai trò
                    </th>
                    {roles.map((role) => (
                      <th
                        key={role.role}
                        className="border px-4 py-2 bg-gray-100"
                      >
                        {role.role}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((permission, rowIdx) => (
                    <tr key={permission}>
                      <td className="border px-4 py-2 font-medium">
                        {permission}
                      </td>
                      {roles.map((role) => (
                        <td key={role.role} className="border px-4 py-2">
                          {role.rights[rowIdx] ? (
                            <CheckCircleTwoTone twoToneColor="#52c41a" />
                          ) : (
                            <CloseCircleTwoTone twoToneColor="#ff4d4f" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Modal>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProjectSettingPopover;
