import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Table, Popconfirm, message, Modal, Select } from "antd";
import styles from "../styles/ProjectSettingPopover.module.scss";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  SyncOutlined,
  ReadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addStatus, deleteStatus, editStatus } from "@/redux/statusSlice";

const ProjectSettingPopover = ({ onClose }) => {
  const popoverRef = useRef(null);
  const dispatch = useDispatch();
  const statuses = useSelector((state) => state.status.statuses);

  const [activeTab, setActiveTab] = useState("workflow");
  const [users, setUsers] = useState([]);
  const [openFunction, setOpenFunction] = useState(false);
  const [fromState, setFromState] = useState("");
  const [toState, setToState] = useState("");
  const [flows, setFlows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [editingLabel, setEditingLabel] = useState(null);
  const [newStatusLabel, setNewStatusLabel] = useState("");
  const [addStatusValue, setAddStatusValue] = useState("");

  const roleOptions = ["PM", "Dev", "Test", "BA", "User"];
  const permissions = ["View", "Add", "Edit", "Delete", "Comment", "Drag"];
  const roles = [
    { role: "PM", rights: [1, 1, 1, 1, 0, 1] },
    { role: "Dev", rights: [1, 0, 0, 0, 1, 1] },
    { role: "Test", rights: [1, 0, 0, 0, 1, 1] },
    { role: "BA", rights: [1, 0, 0, 0, 1, 1] },
    { role: "User", rights: [1, 0, 0, 0, 1, 1] },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      const path = event.composedPath();
      const isInPopover = path.some(
        (el) =>
          el instanceof HTMLElement &&
          (el.classList.contains("ant-modal") ||
            el.classList.contains("ant-select-dropdown") ||
            el.classList.contains("ant-popover"))
      );

      if (isInPopover) return;
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleDeleteLabel = (label) => dispatch(deleteStatus(label));

  const handleEditLabel = (label) => {
    setEditingLabel(label);
    setNewStatusLabel(label);
  };

  const handleSaveEditLabel = (oldLabel) => {
    dispatch(editStatus({ oldLabel, newLabel: newStatusLabel }));
    setEditingLabel(null);
  };

  const handleAddStatus = () => {
    if (!addStatusValue.trim()) return;
    dispatch(
      addStatus({
        label: addStatusValue,
        bg: "bg-slate-100",
        text: "text-slate-800",
      })
    );
    setAddStatusValue("");
  };

  const handleAddFlow = () => {
    if (!fromState || !toState) return;
    setFlows([...flows, { from: fromState, to: toState }]);
    setFromState("");
    setToState("");
  };

  const handleEdit = (index) => {
    setIsEditing(true);
    const flowToEdit = flows[index];
    setEditingIndex(index);
    setFromState(flowToEdit.from);
    setToState(flowToEdit.to);
  };

  const handleSaveEdit = () => {
    const updated = [...flows];
    updated[editingIndex] = { from: fromState, to: toState };
    setFlows(updated);
    setIsEditing(false);
    setFromState("");
    setToState("");
  };

  const handleDelete = (index) => setFlows(flows.filter((_, i) => i !== index));

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div
        ref={popoverRef}
        className="bg-white rounded-xl w-full max-w-screen-lg h-[600px] overflow-y-auto border p-6 mx-auto flex"
      >
        <div className="bg-[#f9f9f9] w-[30%] font-bold pl-10">
          <h1 className={styles.projectSetting__title}>WORK FLOW</h1>
          <button
            onClick={() => setActiveTab("workflow")}
            className={`w-48 py-2 border rounded transition block my-2 ${
              activeTab === "workflow"
                ? "text-white bg-[#5f646a]"
                : "hover:bg-[#5f646a] hover:text-white bg-[#eaecf0]"
            }`}
          >
            Quản lý luồng
          </button>
          <button
            onClick={() => setActiveTab("roles")}
            className={`w-48 py-2 border rounded transition ${
              activeTab === "roles"
                ? "text-white bg-[#5f646a]"
                : "hover:bg-[#5f646a] hover:text-white bg-[#eaecf0]"
            }`}
          >
            Quản lý vai trò
          </button>
        </div>

        <div className="w-[70%] h-full flex flex-col items-center">
          {activeTab === "workflow" && (
            <div className="flex w-full h-full overflow-hidden p-3">
              <div className="flex w-full border border-black rounded-2xl">
                <div className="w-[30%] border-r pr-4 pt-4 overflow-y-auto">
                  <h3
                    className={`mb-4 text-center ${styles.projectSetting__statusHeader}`}
                  >
                    TRẠNG THÁI
                  </h3>
                  <ul className="list-disc pl-4 text-sm">
                    {statuses.map((item) => (
                      <li
                        key={item.label}
                        className="flex items-center justify-between mb-2"
                      >
                        {editingLabel === item.label ? (
                          <input
                            value={newStatusLabel}
                            onChange={(e) => setNewStatusLabel(e.target.value)}
                            onBlur={() => handleSaveEditLabel(item.label)}
                            autoFocus
                            className="flex-1 px-2 py-1 text-sm border rounded"
                            style={{
                              height: "35px",
                              marginLeft: "-15px",
                              marginRight: "10px",
                            }}
                          />
                        ) : (
                          <span
                            className={`${item.bg} ${item.text} px-3 rounded`}
                            style={{
                              flex: 1,
                              height: "35px",
                              display: "flex",
                              alignItems: "center",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              fontSize: "0.6rem",
                              fontWeight: "600",
                              marginLeft: "-15px",
                              marginRight: "10px",
                            }}
                          >
                            {item.label}
                          </span>
                        )}
                        <div className="flex gap-2">
                          <Popconfirm
                            title="Bạn có chắc xóa?"
                            okText="Xóa"
                            cancelText="Hủy"
                            onConfirm={() => handleDeleteLabel(item.label)}
                          >
                            <Button
                              icon={<DeleteOutlined />}
                              type="primary"
                              danger
                            />
                          </Popconfirm>
                          <Button
                            icon={<EditOutlined />}
                            type="primary"
                            onClick={() => handleEditLabel(item.label)}
                          />
                        </div>
                      </li>
                    ))}
                    <li className="flex items-center justify-center mt-4 space-x-2">
                      <input
                        value={addStatusValue}
                        onChange={(e) => setAddStatusValue(e.target.value)}
                        placeholder="Nhập trạng thái mới"
                        className="flex-1 px-1 py-1 text-sm border rounded"
                        style={{ marginLeft: "-15px" }}
                      />
                    </li>
                  </ul>
                  <div className="flex justify-center mt-4">
                    <button
                      type="button"
                      onClick={handleAddStatus}
                      className="flex items-center gap-1 border border-gray-400 rounded px-3 py-1 hover:text-white hover:bg-green-400 transition"
                    >
                      <PlusOutlined /> Thêm trạng thái
                    </button>
                  </div>
                </div>

                <div className="w-[70%] px-2 pt-4 mx-auto overflow-y-auto max-w-[800px]">
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    ROLES
                  </h3>
                  <div className="flex justify-center gap-6 flex-wrap text-sm">
                    {["ADMIN", "PM", "DEV", "TEST", "BA", "USER"].map(
                      (role) => (
                        <label key={role} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="userRole"
                            value={role}
                            className="accent-blue-500"
                          />
                          <span>{role}</span>
                        </label>
                      )
                    )}
                  </div>

                  <div className="flex flex-col gap-4 pt-4">
                    <div className="flex flex-col items-start mt-3">
                      <label className="font-medium">Từ trạng thái:</label>
                      <Select
                        className="w-full"
                        placeholder="Chọn trạng thái bắt đầu"
                        value={fromState}
                        onChange={(value) => setFromState(value)}
                        options={statuses.map((s) => ({
                          label: s.label,
                          value: s.label,
                        }))}
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <label className="font-medium">Đến trạng thái:</label>
                      <Select
                        className="w-full"
                        placeholder="Chọn trạng thái kết thúc"
                        value={toState}
                        onChange={(value) => setToState(value)}
                        options={statuses.map((s) => ({
                          label: s.label,
                          value: s.label,
                        }))}
                      />
                    </div>
                    {isEditing && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-600 hover:underline"
                        >
                          💾 Lưu chỉnh sửa
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center mt-4">
                    <button
                      onClick={handleAddFlow}
                      className="flex items-center gap-1 border border-gray-400 rounded px-3 py-1 hover:border-blue-500 hover:bg-blue-500 transition"
                    >
                      Thêm luồng
                    </button>
                  </div>

                  <div className="mt-2 pt-1">
                    <h5 className="font-semibold mb-2 ">
                      <SyncOutlined style={{ marginRight: "6px" }} />
                      Các luồng đã tạo:
                    </h5>
                    {flows.length === 0 ? (
                      <p className="text-gray-500">
                        Chưa có luồng nào được tạo.
                      </p>
                    ) : (
                      <ul className="list-disc pl-3 space-y-1">
                        {flows.map((flow, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center border p-2 rounded gap-3"
                          >
                            <span className="flex-1">
                              {flow.from} ➝ {flow.to}
                            </span>
                            <button
                              onClick={() => handleEdit(index)}
                              className="text-blue-500 hover:underline"
                            >
                              ✏️ Chỉnh sửa
                            </button>
                            <Popconfirm
                              title="Bạn có chắc chắn xóa luồng này không?"
                              cancelText="Hủy"
                              okText="Xóa"
                              onConfirm={() => handleDelete(index)}
                            >
                              <button className="text-red-500 hover:underline ml-4">
                                🗑 Xóa
                              </button>
                            </Popconfirm>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
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
