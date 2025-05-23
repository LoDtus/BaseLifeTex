import React, { useContext, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Checkbox, Input, message } from "antd";
import { useState } from "react";
import { addRole, updateRole } from "../../../services/projectRoleService";
import { mya } from "../../../redux/Context";

const AddRoleModal = ({
  onClose,
  id,
  onSuccess,
  formMode,
  roleFormData,
  setRoleFormData,
  setFormMode,
}) => {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const {state, setState} = useContext(mya);

  const PROJECT_ROLE_PERMISSIONS = [
 
    "Add",
    "Edit",
    "Delete",
   
  ];
  // Populate form when editing
  useEffect(() => {
    if (formMode === "edit" && roleFormData) {
      setRoleName(roleFormData.roleName || "");
      setDescription(roleFormData.description || "");
      setPermissions(roleFormData.permissions || []);
    } else {
      // Nếu là "add", reset form
      setRoleName("");
      setDescription("");
      setPermissions([]);
    }
  }, [formMode, roleFormData]);

  const handlePermissionChange = (checkedValues) => {
    setPermissions(checkedValues);
  };

  const handleSubmit = async () => {
    if (!roleName.trim()) {
      message.warning("Vui lòng nhập tên vai trò");
      return;
    }
    if (!description.trim()) {
      message.warning("Vui lòng nhập mô tả");
      return;
    }
    if (permissions.length === 0) {
      message.warning("Vui lòng chọn quyền");
      return;
    }

    setLoading(true);
    try {
      if (formMode === "add") {
        const data = await addRole({
          projectId: id,
          roleName,
          description,
          permissions,
        });
        if (data) {
          message.success("Thêm vai trò thành công");
          onSuccess();
          onClose();
          setFormMode();
          setRoleFormData();
          setState(!state)
        }
      } else {
        const updatedRole = {
          ...roleFormData,
          projectId: id,
          roleName,
          description,
          permissions,
        };
        const data = await updateRole(updatedRole);
        if (data) {
          message.success("Cập nhật vai trò thành công");
          onSuccess();
          onClose();
          setFormMode();
          setRoleFormData();
          setState(!state)
        }
      }
    } catch (err) {
      console.error(err);
      message.error(
        formMode === "add"
          ? "Thêm vai trò thất bại"
          : "Cập nhật vai trò thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col">
        <div className="flex justify-between items-center px-4 py-4 border-b">
          <h5 className="font-semibold text-gray-900 m-0">
            {formMode === "add" ? "Thêm vai trò" : "Cập nhật vai trò"}
          </h5>
          <button
            onClick={() => {
              onClose();
              setRoleFormData();
              setFormMode();
            }}
            className="text-gray-400 hover:text-gray-700 transition-colors duration-200"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên vai trò
            </label>
            <Input
              placeholder="Nhập tên vai trò"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <Input.TextArea
              placeholder="Nhập mô tả vai trò"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quyền hạn
            </label>
            <Checkbox.Group
              options={PROJECT_ROLE_PERMISSIONS}
              value={permissions}
              onChange={handlePermissionChange}
              className="flex flex-wrap gap-3"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              onClick={() => {
                onClose();
                setRoleFormData();
                setFormMode();
              }}
            >
              Hủy
            </Button>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              {formMode === "add" ? "Thêm" : "Cập nhật"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRoleModal;
