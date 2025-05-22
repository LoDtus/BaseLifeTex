import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReadOutlined,
  SearchOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Button, Input, message, Modal, Popconfirm, Table } from "antd";
import styles from "../styles/ProjectSettingPopover.module.scss";
import { useContext, useEffect, useState } from "react";
import {
  deleteProjectRoles,
  deleteRoles,
  getById,
  getRoleIdProject,
} from "../../../services/projectRoleService";
import { useLocation } from "react-router-dom";
import AddRoleModal from "./AddRoleModal";
import { mya } from "../../../redux/Context";

const RoleManagement = ({ onSuccess }) => {
  const [users, setUsers] = useState([]);
  //   const [selectedRolea, setSelectedRolea] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const location = useLocation(); // lấy URL hiện tại
  const queryParams = new URLSearchParams(location.search); // phân tích chuỗi query
  const idProject = queryParams.get("idProject"); // lấy giá trị idProject
  const [check, setcheck] = useState(false);
  const [search, setSearch] = useState("");
  const [filterUser, setfilterUser] = useState([]);
  const [isAssignRoleModalOpen, setIsAssignRoleModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add"); // hoặc 'edit'
  const [roleFormData, setRoleFormData] = useState({
    _id: "",
    roleName: "",
    description: "",
    permissions: [],
  });
  const {state, setState} = useContext(mya);
  useEffect(() => {
    (async () => {
      if (idProject) {
        const data = await getRoleIdProject(idProject);
        setUsers(data);
      }
    })();
  }, [check]);
  // console.log(users);
  // const ROLES = {
  //   PM: 0,
  //   DEV: 1,
  //   TEST: 2,
  //   BA: 3,
  //   USER: 4,
  // };
  // const roleOptions = Object.keys(ROLES).map((key) => ({
  //   label: key, // Hiển thị trên dropdown
  //   value: ROLES[key], // Giá trị thực được lưu
  // }));
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
      //   width: 60,
    },
    {
      title: "Tên vai trò",
      dataIndex: "roleName",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            size="small"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setIsAssignRoleModalOpen(true),
                setFormMode("edit"),
                setRoleFormData({
                  _id: record?._id,
                  roleName: record?.roleName,
                  description: record?.description,
                  permissions: record?.permissions,
                });
            }} // Gọi hàm sửa
          ></Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDeleteUser([record?._id])}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              danger
              size="small"
              type="primary"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];
  // Xóa người
  const handleDeleteUser = async (Id) => {
    try {
      const remove = await deleteProjectRoles(Id);
      setcheck((prev) => !prev); // chỉ rely on API
      //   setSelectedRolea((prev) => prev); // ép render lại filter
      if (remove) {
        message.success("Đã xóa người dùng");
        setState(!state)
      }
    } catch (error) {
      console.log(error);
      message.success("Xoá thất bại");
    }
  };
  // xóa tất cả người dùng
  const handleDeleteMultipleUsers = async () => {
    try {
      const promises = await deleteProjectRoles(selectedRowKeys);
      setSelectedRowKeys([]);
      setcheck((prev) => !prev); // Gọi lại API để cập nhật danh sách
      if (promises) {
        message.success("Đã xóa tất cả người dùng được chọn.");
        setState(!state)
      }
    } catch (error) {
      console.error(error);
      message.error("Xóa người dùng thất bại.");
    }
  };
  // const filteredData =
  //   selectedRolea === null
  //     ? []
  //     : (users || []).filter((item) => item.role === selectedRolea);
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

      const filtered = users.filter((note) => {
        const title = normalizeString(note?.roleName);
        return title.includes(keyword);
      });

      setfilterUser(filtered);
    } else {
      setfilterUser([]);
    }
  }, [users, search, check]);
  const userRoles = search.trim() !== "" ? filterUser : users;

  //   ///////////////////////////////////////////////
  const [openFunction, setOpenFunction] = useState(false);
  // const roles = [
  //   { role: "PM", rights: [1, 1, 1, 1, 0, 1] },
  //   { role: "Dev", rights: [1, 0, 0, 0, 1, 1] },
  //   { role: "Test", rights: [1, 0, 0, 0, 1, 1] },
  //   { role: "BA", rights: [1, 0, 0, 0, 1, 1] },
  //   { role: "User", rights: [1, 0, 0, 0, 1, 1] },
  // ];
  const roles = users
    ? users.map((item) => ({
        roleName: item?.roleName,
        permissions: item?.permissions,
      }))
    : [];
  const permissions = ["View", "Add", "Edit", "Delete", "Comment", "Drag"];
  //   /////////////////////////////////////////////////////////////////////////////\

  return (
    <div className="w-full px-4">
      <h2
        className={`text-lg font-semibold pt-4 mb-4 text-center ${styles.projectSetting__roleTitle}`}
      >
        QUẢN LÝ VAI TRÒ
      </h2>
      {/* Dòng này sẽ nằm sát trái */}
      <div className="w-full mt-4">
        <div className="mt-4 flex items-center gap-4 justify-between ">
          <Button
            icon={<SettingOutlined />}
            onClick={() => setOpenFunction(true)}
            className="border border-gray-500 hover:text-white px-3 py-1 rounded hover:bg-[#5F646A] transition-all"
          >
            Chức năng
          </Button>
          <Button
            icon={<PlusOutlined />}
            type="dashed"
            onClick={() => setIsAssignRoleModalOpen(true)}
            className="hover:bg-blue-500 hover:text-white transition-all"
          >
            Thêm vai trò
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Input
            placeholder="Tìm kiếm vai trò..."
            prefix={<SearchOutlined />}
            className="!w-64"
            allowClear
            onChange={(e) => setSearch(e.target.value)}
          />

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
        <div className="text-left font-bold flex justify-content-between items-center  mt-4">
          <div className="">
            <ReadOutlined style={{ marginRight: "4px" }} />
            DANH SÁCH 
          </div>
          <Button
            icon={<UsergroupAddOutlined />}
            onClick={() => onSuccess()}
            className="border border-gray-400 px-3 py-1 hover:bg-[#5f646a] hover:text-white transition-all"
          >
            Quản lý userRole
          </Button>
        </div>
        <div className="mt-2">
          <Table
            rowKey={(record) => record?._id}
            rowSelection={rowSelection}
            dataSource={userRoles}
            columns={userColumns}
            pagination={{ pageSize: 5 }}
            size="small"
            bordered
          />
        </div>
      </div>
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
                {roles.map((role, index) => (
                  <th key={index} className="border px-4 py-2 bg-gray-100">
                    {role?.roleName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2 font-medium">{permission}</td>
                  {roles.map((role, rIndex) => (
                    <td key={rIndex} className="border px-4 py-2">
                      {role?.permissions.includes(permission) ? (
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
      {isAssignRoleModalOpen && (
        <AddRoleModal
          id={idProject}
          onClose={() => setIsAssignRoleModalOpen(false)}
          formMode={formMode}
          roleFormData={roleFormData}
          setRoleFormData={() =>
            setRoleFormData({
              _id: "",
              roleName: "",
              description: "",
              permissions: [],
            })
          }
          setFormMode={()=>setFormMode("add")}
          // role={userRoles}
          // selectedRolea={selectedRolea}
          onSuccess={() => setcheck((prev) => !prev)}
        />
      )}
    </div>
  );
};

export default RoleManagement;
