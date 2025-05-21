import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  Table,
  Popconfirm,
  message,
  Modal,
  Select,
  Pagination,
  Button,
  Input,
} from "antd";
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

import { useDispatch, useSelector } from "react-redux";
import {
  addWorkflowStep,
  removeWorkflowStep,
  editWorkflowStep,
deleteAllWorkflowStepsThunk,
  fetchWorkflowSteps,
  creatworkflow,
} from "@/redux/statusSlice";
import {
  fetchWorkflowTransitions,
  addWorkflowTransition,
  editWorkflowTransition,
  removeWorkflowTransition,

  deleteAllWorkflowTransitionsThunk,
  // setWorkflowId,
} from "@/redux/workflowSlice";
import { getworkflowbyid } from "../../../services/workflowService.js";

import { useLocation } from "react-router-dom";
import { deleteRoles, getById } from "../../../services/projectRoleService.js";
import AssignRoleModal from "./AssignRoleModal.jsx";
const ProjectSettingPopover = ({ onClose }) => {
  const popoverRef = useRef(null);
  const dispatch = useDispatch();
  const steps = useSelector((state) => state.status.steps);
  const [activeTab, setActiveTab] = useState("workflow");
  const [workflows, setWorkflows] = useState([]);
  const [fromState, setFromState] = useState(null);
  const [toState, setToState] = useState(null);

  const transitions = useSelector((state) => state.workflow.transitions);
  const safeTransitions = Array.isArray(transitions) ? transitions : [];

  const [editingIndex, setEditingIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState([]);
  const [editingLabel, setEditingLabel] = useState(null);
  const [newStatusLabel, setNewStatusLabel] = useState("");
  const [addStatusValue, setAddStatusValue] = useState("");

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [openFunction, setOpenFunction] = useState(false);
  const [users, setUsers] = useState([]);

  const workflowIdFromStatus = useSelector((state) => state.status.workflowId);
  const user = useSelector((state) => state.auth.user);
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const managerId = user?._id; // hoặc lấy managerId từ dự án
  const projectId = query.get("idProject");
const findRoleOptionByValue = (value) => {
  return roleOptions.find((option) => option.value === value);
};
  // phan trang
  const itemsPerPage = 2;
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setCurrentPage(1);
  }, [safeTransitions]);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFlows = safeTransitions.slice(startIndex, endIndex);
  // màu trạng thái
  const colors = [
    "#ffadad", // đỏ nhạt
    "#ffd6a5", // cam nhạt
    "#fdffb6", // vàng nhạt
    "#caffbf", // xanh nhạt
    "#9bf6ff", // xanh da trời nhạt
    "#a0c4ff", // xanh dương nhạt
    "#bdb2ff", // tím nhạt
    "#ffe0f0", // hồng phấn nhạt
    "#e0ffe7", // xanh bạc hà nhạt
    "#f0f0ff", // xanh tím nhạt (lavender nhạt)
  ];
 const currentWorkflowId = workflows?.[0]?._id ?? null;
useEffect(() => {
  if (currentWorkflowId) {
    dispatch(fetchWorkflowSteps(currentWorkflowId));
    dispatch(fetchWorkflowTransitions(currentWorkflowId));
  }
}, [currentWorkflowId, dispatch]);
  const handleDeleteAllSteps = async () => {
  if (!currentWorkflowId) {
    message.error("Vui lòng tạo workflow trước khi xoá các trạng thái.");
    return;
  }

  try {
    await dispatch(deleteAllWorkflowStepsThunk(currentWorkflowId)).unwrap();
    // await dispatch(fetchWorkflowTransitions(currentWorkflowId)).unwrap();
    message.success("Đã xoá tất cả trạng thái.");

  } catch (error) {
    console.error("Lỗi xoá tất cả trạng thái:", error);
    message.error("Xoá tất cả trạng thái thất bại.");
  }
};
  const handleDeleteLabel = async (workflowStepId) => {
    try {
      const res = await dispatch(removeWorkflowStep(workflowStepId));
      if (res.meta.requestStatus === "fulfilled") {
        message.success("Đã xóa trạng thái");
 
        if (currentWorkflowId) {
          await dispatch(fetchWorkflowSteps(currentWorkflowId));
        }
      } else {
        message.error("Xóa trạng thái thất bại");
      }
    } catch (error) {
      message.error("Xóa trạng thái thất bại");
    }
  };
  const handleEditLabel = (id, currentName) => {
    setEditingLabel(id);
    setNewStatusLabel(currentName);
  };

  const handleSaveEditLabel = async (workflowStepId) => {
    try {
      const res = await dispatch(
        editWorkflowStep({
          workflowStepId,
          data: { nameStep: newStatusLabel },
        })
      );
      if (res.meta.requestStatus === "fulfilled") {
        message.success("Cập nhật trạng thái thành công");
        setEditingLabel(null);
        const currentWorkflowId = workflows?.[0]?._id ?? null;
        if (currentWorkflowId) {
          await dispatch(fetchWorkflowSteps(currentWorkflowId));
        }
      } else {
        message.error("Cập nhật trạng thái thất bại");
      }
    } catch (error) {
      message.error("Cập nhật trạng thái thất bại");
    }
  };
  const handleAddStatus = async () => {
    if (!addStatusValue.trim()) return;

   const idWorflow = await getworkflowbyid(idProject);
    const currentWorkflowId = idWorflow?.data[0]?._id ?? null;

    if (!currentWorkflowId) {
      message.error("Vui lòng tạo workflow trước khi thêm trạng thái.");
      return;
    }

    const payload = {
      workflowId: currentWorkflowId,
      nameStep: addStatusValue.trim(),
      stepOrder: 1,
      requiredRole: [1, 3],
      isFinal: false,
    };

    try {
      const res = await dispatch(addWorkflowStep(payload));

      if (res.meta.requestStatus === "fulfilled") {
        message.success("Thêm trạng thái thành công");
        setAddStatusValue("");
        await dispatch(fetchWorkflowSteps(currentWorkflowId));
      } else {
        message.error("Thêm trạng thái thất bại");
      }
    } catch (error) {
      console.error("❌ Lỗi khi thêm trạng thái:", error);
      message.error("Thêm trạng thái thất bại");
    }
  };
  
  const fromStep = fromState;
  const toStep = toState;
 

  const resetTransitionForm = () => {
    setFromState(null);
    setToState(null);
    setSelectedRole([]);
    setIsEditing(false);
    setEditingIndex(null);
  };
  

  const handleAddFlow = async () => {
    if (!fromState || !toState || !selectedRole?.length) {
      message.warning("Vui lòng nhập đầy đủ trạng thái và vai trò");
      return;
    }

   if (fromState === toState) {
      message.warning("Trạng thái bắt đầu và kết thúc không được giống nhau");
      return;
    }
    const allowedRoles = selectedRole.map((role) => role.value);
console.log("allowedRoles to send:", allowedRoles);
    if (!currentWorkflowId) {
      message.error("Vui lòng tạo workflow trước khi thêm trạng thái.");
      return;
    }

    try {
      await dispatch(
        addWorkflowTransition({
          workflowId: currentWorkflowId,
          fromStep,
          toStep,
          allowedRoles,
        })
      ).unwrap();
      // await dispatch(fetchWorkflowTransitions(currentWorkflowId)).unwrap();
      message.success("Thêm luồng thành công");
      resetTransitionForm();
    } catch (err) {
      console.error("Lỗi thêm luồng:", err);
      message.error("Thêm luồng thất bại");
    }
  };

  const handleEdit = (index) => {
    const trans = transitions[index];
    if (!trans) return;

    setFromState(trans.fromStep); // chú ý dùng fromStep
    setToState(trans.toStep); // dùng toStep
  setSelectedRole(
  Array.isArray(trans.allowedRoles)
    ? trans.allowedRoles
        .map((r) => findRoleOptionByValue(r))
        .filter(Boolean) 
    : []
);
    setEditingIndex(index);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!fromState || !toState || selectedRole.length === 0) {
      message.warning("Vui lòng chọn đầy đủ trạng thái và vai trò!");
      return;
    }
    const allowedRoles = selectedRole.map((role) => role.value);
    if (fromState === toState) {
      message.warning("Trạng thái bắt đầu và kết thúc không được giống nhau")}
    try {
      const editingTransition = transitions[editingIndex];
      if (!editingTransition) return;

      const updatedTransition = {
        fromStep,
        toStep,
        allowedRoles,
      };

      // dispatch async thunk editWorkflowTransition và unwrap để xử lý lỗi
      await dispatch(
        editWorkflowTransition({
          id: editingTransition._id,
          data: updatedTransition,
        })
      ).unwrap();
      // await dispatch(fetchWorkflowTransitions(currentWorkflowId)).unwrap();
      message.success("Cập nhật luồng thành công");
      resetTransitionForm();
    } catch (error) {
      console.error("Lỗi cập nhật luồng:", error);
      message.error("Cập nhật luồng thất bại");
    }
  };
  const handleDelete = async (index) => {
    try {
      const transitionToDelete = transitions[index];
      if (!transitionToDelete) return;

      // dispatch async thunk removeWorkflowTransition và unwrap
      await dispatch(removeWorkflowTransition(transitionToDelete._id)).unwrap();
      // await dispatch(fetchWorkflowTransitions(currentWorkflowId)).unwrap();
      message.success("Xóa luồng thành công");
    } catch (error) {
      console.error("Lỗi xóa luồng:", error);
      message.error("Xóa luồng thất bại");
    }
  };
  const handleDeleteAllTransitions = async () => {
  if (!currentWorkflowId) {
    message.error("Vui lòng tạo workflow trước khi xoá các luồng.");
    return;
  }

  const confirm = window.confirm("Bạn có chắc chắn muốn xoá tất cả các luồng?");
  if (!confirm) return;

  try {
    await dispatch(deleteAllWorkflowTransitionsThunk(currentWorkflowId)).unwrap();
    // await dispatch(fetchWorkflowTransitions(currentWorkflowId)).unwrap();
    message.success("Đã xoá tất cả luồng thành công.");
    resetTransitionForm();
  } catch (error) {
    console.error("Lỗi xoá tất cả luồng:", error);
    message.error("Xoá tất cả luồng thất bại.");
  }
};

  const permissions = ["View", "Add", "Edit", "Delete", "Comment", "Drag"];

  useEffect(() => {
    if (!projectId) return;

    (async () => {
      try {
        const res = await getworkflowbyid(projectId);
        if (Array.isArray(res?.data)) {
          setWorkflows(res.data);
        } else {
          setWorkflows([]);
        }
      } catch (err) {
        console.error("❌ Không lấy được workflow:", err);
      }
    })();
  }, [projectId]);

  const roles = [
    { role: "PM", rights: [1, 1, 1, 1, 0, 1] },
    { role: "Dev", rights: [1, 0, 0, 0, 1, 1] },
    { role: "Test", rights: [1, 0, 0, 0, 1, 1] },
    { role: "BA", rights: [1, 0, 0, 0, 1, 1] },
    { role: "User", rights: [1, 0, 0, 0, 1, 1] },
  ];
  const [selectedRolea, setSelectedRolea] = useState(0);
  const { Option } = Select;
  const location = useLocation(); // lấy URL hiện tại
  const queryParams = new URLSearchParams(location.search); // phân tích chuỗi query
  const idProject = queryParams.get("idProject"); // lấy giá trị idProject
  const [check, setcheck] = useState(false);
  const [search, setSearch] = useState("");
  const [filterUser, setfilterUser] = useState([]);
  const [isAssignRoleModalOpen, setIsAssignRoleModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getById(idProject);
      setUsers(data);
    })();
  }, [check]);

  const ROLES = {
    PM: 0,
    DEV: 1,
    TEST: 2,
    BA: 3,
    USER: 4,
  };
  const roleOptions = Object.keys(ROLES).map((key) => ({
    label: key, // Hiển thị trên dropdown
    value: ROLES[key], // Giá trị thực được lưu
  }));
const ROLES_REVERSE = Object.fromEntries(
  Object.entries(ROLES).map(([key, val]) => [val, key])
);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: false,
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
      dataIndex: ["userId", "userName"],
    },
    {
      title: "Email",
      dataIndex: ["userId", "email"],
    },
    {
      title: "Xóa",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() =>
            handleDeleteUser(record?.projectId, [record?.userId?._id])
          }
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button danger size="small" type="primary">
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      ),
      width: 80,
    },
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Xóa người
  const handleDeleteUser = async (projectId, userId) => {
    try {
      const remove = await deleteRoles(projectId, userId, selectedRolea);
      setcheck((prev) => !prev); // chỉ rely on API
      setSelectedRolea((prev) => prev); // ép render lại filter
      if (remove) {
        message.success("Đã xóa người dùng");
      }
    } catch (error) {
      console.log(error);
      message.success("Xoá thất bại");
    }
  };
  // xóa tất cả người dùng
  const handleDeleteMultipleUsers = async () => {
    try {
      const promises = await deleteRoles(
        idProject,
        selectedRowKeys,
        selectedRolea
      );
      setSelectedRowKeys([]);
      setcheck((prev) => !prev); // Gọi lại API để cập nhật danh sách
      if (promises) {
        message.success("Đã xóa tất cả người dùng được chọn.");
      }
    } catch (error) {
      console.error(error);
      message.error("Xóa người dùng thất bại.");
    }
  };
  const filteredData =
    selectedRolea === null
      ? []
      : (users || []).filter((item) => item.role === selectedRolea);
  useEffect(() => {
    if (search.trim() !== "") {
      const normalizeString = (str) =>
        str
          .toLowerCase()
          .normalize("NFD") // chuẩn hóa Unicode
          .replace(/[\u0300-\u036f]/g, "") // loại dấu
          .replace(/\s+/g, " ") // xóa khoảng trắng thừa
          .trim();

      const keyword = normalizeString(search);

      const filtered = filteredData.filter((note) => {
        const title = normalizeString(note.userId.userName);
        return title.includes(keyword);
      });

      setfilterUser(filtered);
    } else {
      setfilterUser([]);
    }
  }, [users, search, check]);
  const userRoles = search.trim() !== "" ? filterUser : filteredData;
  useEffect(() => {
    (async () => {
      try {
        if (!idProject) {
          return;
        }
        const idWorflow = await getworkflowbyid(idProject);
        if (!idWorflow?.data[0]?._id) {
          const actionResult = await dispatch(creatworkflow(projectId));
          if (creatworkflow.fulfilled.match(actionResult)) {
            message.success("Tạo workflow thành công");
            // workflowId và currentWorkflow đã được cập nhật trong slice (theo extraReducers)
          } else {
            message.error("Hiện tại đã có workflow trong dự án này");
          }
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [idProject]);
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div
        ref={popoverRef}
        className="bg-white rounded-xl w-full max-w-screen-lg h-[600px] overflow-y-auto border p-6 mx-auto flex"
      >
        <div className="bg-[#f9f9f9] w-[30%] font-bold pl-10 text-center">
          <h1 className={styles.projectSetting__title}>WORK FLOW</h1>
          <button
            onClick={() => setActiveTab("workflow")}
            className={`w-48 py-2 border rounded transition  my-2 ${
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
                  {/* <button
                    onClick={async () => {
                      if (!projectId) {
                        message.error("Không có projectId hoặc managerId");
                        return;
                      }
                      try {
                        const actionResult = await dispatch(
                          creatworkflow(projectId)
                        );
                        if (creatworkflow.fulfilled.match(actionResult)) {
                          message.success("Tạo workflow thành công");
                          // workflowId và currentWorkflow đã được cập nhật trong slice (theo extraReducers)
                        } else {
                          message.error(
                            "Hiện tại đã có workflow trong dự án này"
                          );
                        }
                      } catch (error) {
                        message.error("Tạo workflow thất bại");
                      }
                    }}
                  >
                    add workflow
                  </button> */}

                  <h3
                    className={`mb-4 text-center ${styles.projectSetting__statusHeader}`}
                  >
                    TRẠNG THÁI
                  </h3>
                  <ul className="list-disc pl-4 text-sm">
                    {Array.isArray(steps) &&
                      steps.map((item, index) => (
                        <li
                          key={item._id}
                          className="flex items-center justify-between mb-2"
                        >
                          {editingLabel === item._id ? (
                            <input
                              value={newStatusLabel}
                              onChange={(e) =>
                                setNewStatusLabel(e.target.value)
                              }
                              onBlur={() => handleSaveEditLabel(item._id)}
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
                              className={` ${item.text} px-3 rounded`}
                              style={{
                                backgroundColor: colors[index % colors.length],
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
                              {item.nameStep}
                            </span>
                          )}
                          <div className="flex gap-2">
                            <Popconfirm
                              title="Bạn có chắc xóa?"
                              okText="Xóa"
                              cancelText="Hủy"
                              onConfirm={() => handleDeleteLabel(item._id)}
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
                              onClick={() =>
                                handleEditLabel(item._id, item.nameStep)
                              }
                            />
                          </div>
                        </li>
                        
                      ))}
                        {steps.length > 0 && (
    <li className="flex justify-end mt-4">
      <Popconfirm
        title="Bạn có chắc chắn muốn xoá tất cả trạng thái?"
        okText="Xóa tất cả"
        cancelText="Hủy"
        onConfirm={handleDeleteAllSteps}
      >
          <button className="text-red-500 hover:underline text-sm">
                            🧹 Xóa tất cả
                          </button>
      </Popconfirm>
    </li>
  )}
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
                      className="flex items-center gap-1 border border-gray-400 rounded px-3 py-1 hover:text-white  hover:bg-[#5F646A] transition"
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
                    {[ "PM", "DEV", "TEST", "BA", "USER"].map(
                      (role) => (
                        <label key={role} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            value={role}
                            className="accent-blue-500"
                            checked={selectedRole.some(r => r.value === ROLES[role])}
                            onChange={(e) => {
                               if (e.target.checked) {
    setSelectedRole([...selectedRole, { label: role, value: ROLES[role] }]);
  } else {
    setSelectedRole(selectedRole.filter(r => r.value !== ROLES[role]));
  }
                            }}
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
                        options={
                          Array.isArray(steps)
                            ? steps.map((s) => ({
                                label: s.nameStep,
                                value: s._id,
                              }))
                            : []
                        }
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <label className="font-medium">Đến trạng thái:</label>
                      <Select
                        className="w-full"
                        placeholder="Chọn trạng thái kết thúc"
                        value={toState}
                        onChange={(value) => setToState(value)}
                        options={
                          Array.isArray(steps)
                            ? steps.map((s) => ({
                                label: s.nameStep,
                                value: s._id,
                              }))
                            : []
                        }
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
                      className={`flex items-center gap-1 border rounded px-3 py-1 transition
    ${
      !fromState || !toState || !selectedRole
        ? "cursor-not-allowed opacity-50"
        : "hover:border-blue-500 hover:bg-blue-500"
    }
  `}
                    >
                      Thêm luồng
                    </button>
                  </div>

                  <div className="mt-2 pt-1">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-semibold">
                        <SyncOutlined style={{ marginRight: "6px" }} />
                        Các luồng đã tạo:{" "}
                        {safeTransitions.length > 0
                          ? `(${safeTransitions.length})`
                          : ""}
                      </h5>
                      {safeTransitions.length > 0 && (
                        <Popconfirm
                          title="Bạn có chắc muốn xóa tất cả các luồng không?"
                          okText="Xóa"
                          cancelText="Hủy"
                         onClick={handleDeleteAllTransitions}
                        >
                          <button className="text-red-500 hover:underline text-sm">
                            🧹 Xóa tất cả
                          </button>
                        </Popconfirm>
                      )}
                    </div>

                    {safeTransitions.length === 0 ? (
                      <p className="text-gray-500">
                        Chưa có luồng nào được tạo.
                      </p>
                    ) : (
                      <>
                        <ul className="list-disc pl-3 space-y-1">
                          {paginatedFlows.map((flow, index) => {
                            const fromStep = steps.find(
                              (s) => s._id === flow.fromStep
                            );
                            const toStep = steps.find(
                              (s) => s._id === flow.toStep
                            );

                            return (
                              <li
                                key={`${flow.fromStep}-${flow.toStep}-${(
                                  flow.allowedRoles || []
                                ).join("-")}`}
                                className="flex justify-between items-center border p-2 rounded gap-3"
                              >
                                <span className="flex-1">
                                  {fromStep?.nameStep || "Không xác định"} ➝ {" "}
                                  {toStep?.nameStep || "Không xác định"}  
    { flow.allowedRoles?.length > 0 && (
  <strong className="ml-2 text-sm text-gray-600">
    (
    { flow.allowedRoles.map((roleValue) => ROLES_REVERSE[roleValue] || "?").join(", ")}
    )
  </strong>
)}
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
                            );
                          })}
                        </ul>

                        {safeTransitions.length > itemsPerPage && (
                          <div className="mt-2 flex justify-end">
                            <Pagination
                              current={currentPage}
                              pageSize={itemsPerPage}
                              total={safeTransitions.length}
                              onChange={(page) => setCurrentPage(page)}
                              size="small"
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "roles" && (
            <div className="w-full px-4">
              <h2
                className={`text-lg font-semibold pt-4 mb-4 text-center ${styles.projectSetting__roleTitle}`}
              >
                QUẢN LÝ VAI TRÒ
              </h2>

              <div className="flex justify-center items-center gap-4">
                <Select
                  placeholder="Chọn vai trò"
                  className={`!w-60 transition duration-200 ${
                    selectedRolea ? "bg-blue-50" : ""
                  }`}
                  value={selectedRolea} // Quan trọng để hiển thị vai trò đã chọn
                  options={roleOptions}
                  onChange={(value) => {
                    setSelectedRolea(value);
                  }}
                />
              </div>

              {/* Dòng này sẽ nằm sát trái */}
              <div className="w-full mt-4">
                <div className="mt-4 flex items-center gap-4 justify-between ">
                  <Input
                    placeholder="Tìm kiếm người dùng..."
                    prefix={<SearchOutlined />}
                    className="!w-64"
                    allowClear
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    onClick={() => setOpenFunction(true)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-[#5F646A]"
                  >
                    chức năng
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => setIsAssignRoleModalOpen(true)}
                    className="flex items-center gap-1 border border-gray-400 rounded px-3 py-1 hover:bg-[#5f646a] hover:text-white  transition"
                  >
                    <PlusOutlined />
                    Thêm người
                  </button>

                  <div className="">
                    {selectedRowKeys.length > 0 && (
                      <Popconfirm
                        title={`Xóa ${selectedRowKeys.length} người dùng?`}
                        onConfirm={handleDeleteMultipleUsers}
                        okText="Xóa"
                        cancelText="Hủy"
                      >
                        <Button type="primary" danger size="small">
                          <DeleteOutlined />
                        </Button>
                      </Popconfirm>
                    )}
                  </div>
                </div>
                <div className="text-left font-bold  mt-4">
                  <ReadOutlined style={{ marginRight: "4px" }} />
                  DANH SÁCH TEST
                </div>
                <div className="mt-2">
                  <Table
                    rowKey={(record) => record?.userId?._id}
                    rowSelection={rowSelection}
                    dataSource={userRoles}
                    columns={userColumns}
                    pagination={{ pageSize: 5 }}
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
        {isAssignRoleModalOpen && (
          <AssignRoleModal
            id={idProject}
            onClose={() => setIsAssignRoleModalOpen(false)}
            role={userRoles}
            selectedRolea={selectedRolea}
            onSuccess={() => setcheck((prev) => !prev)}
          />
        )}
      </div>
    </div>,
    document.body
  );
};

export default ProjectSettingPopover;
