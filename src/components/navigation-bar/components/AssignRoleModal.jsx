import React, { useEffect, useMemo, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";

import { getMembers } from "../../../services/projectService";

import { adduserRole, createRole, getById, getRoleIdProject } from "../../../services/projectRoleService";

import { message } from "antd";

const AssignRoleModal = ({ onClose, id, role, selectedRolea, onSuccess }) => {
  const [users, setUsers] = useState([]);

  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const [selectAll, setSelectAll] = useState(false);

  const [search, setSearch] = useState("");

  const [filterUser, setfilterUser] = useState([]);
  
 useEffect(() => {
  (async () => {
    if (id) {
      const response = await getMembers(id); // Tất cả user trong project

      const allRoles = await getRoleIdProject(id); // Tất cả vai trò trong project
      console.log("All Roles:", allRoles);

      // 👉 Lấy tất cả userId từ tất cả role (bất kể role nào)
      const assignedUserIds = allRoles.flatMap(role =>
        role.userIds?.map(user => user._id) || []
      );

      console.log("All assigned userIds:", assignedUserIds);

      // 👉 Lọc: chỉ hiện user chưa có trong bất kỳ vai trò nào
      const unassignedUsers = response.filter(
        user => !assignedUserIds.includes(user._id)
      );

      setUsers(unassignedUsers); // danh sách user chưa phân vai trò
    }
  })();
}, [id, selectedRolea]); // lắng nghe cả khi chọn lại role


  const handleSelect = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUserIds([]);
    } else {
      // Lấy danh sách user đang hiển thị (đã lọc nếu có search)

      const currentList =
        filterUser.length > 0 || search.trim() !== "" ? filterUser : users;

      const allIds = currentList.map((u) => u._id);

      setSelectedUserIds(allIds);
    }

    setSelectAll(!selectAll);
  };
  const handleSubmit = async () => {
    if (selectedUserIds.length === 0) {
      return message.warning("Vui lòng chọn ít nhất một thành viên.");
    }

    try {

      const res = await adduserRole(selectedRolea,{userIds:selectedUserIds});

      if (res) {
        message.success("Thêm thành viên thành công!");

        onSuccess?.(); // 👈 cập nhật lại danh sách

        onClose();
      }
    } catch (error) {
      console.error(error);

      message.error("Thêm thất bại!");
    }
  };
  // useEffect để lọc theo từ khoá search

  useEffect(() => {
    if (search.trim() !== "") {
      const normalizeString = (str) =>
        str

          .toLowerCase()

          .normalize("NFD")

          .replace(/[\u0300-\u036f]/g, "")

          .replace(/\s+/g, " ")

          .trim();

      const keyword = normalizeString(search);

      const filtered = users.filter((user) => {
        const name = normalizeString(user.userName || "");

        return name.includes(keyword);
      });

      setfilterUser(filtered);
    } else {
      setfilterUser([]);
    }
  }, [search, users]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2

w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}

        <div className="flex justify-between items-center px-5 py-4">
          <h5 className="font-semibold text-gray-900 m-0">
            Danh sách thành viên
          </h5>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors duration-200"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <div className="px-5 pb-3 border-b border-gray-200">
          <input
            type="text"
            placeholder="Tìm kiếm thành viên"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Select All */}

        <div className="flex items-center px-5 mt-3">
          <input
            type="checkbox"
            id="selectAll"
            checked={selectAll}
            onChange={handleSelectAll}
            className="w-5 h-5 text-blue-600 rounded border-gray-300"
          />

          <label
            htmlFor="selectAll"
            className="text-sm px-2 font-medium text-gray-700 cursor-pointer"
          >
            Chọn tất cả
          </label>
        </div>

        {/* List */}

        <div className="overflow-y-auto h-[200px] px-5 mt-3">
          {(filterUser.length > 0 || search.trim() !== "" ? filterUser : users)
            .length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Không tìm thấy thành viên.
            </p>
          ) : (
            (filterUser.length > 0 || search.trim() !== ""
              ? filterUser
              : users
            ).map((user) => (
              <div
                key={user._id}
                className="flex items-center mb-3 hover:bg-blue-50 rounded-md py-1 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedUserIds.includes(user._id)}
                  onChange={() => handleSelect(user._id)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 flex-shrink-0"
                />

                <img
                  src={
                    user.avatar
                      ? user.avatar
                      : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
                  }
                  alt={user.userName}
                  className="w-5 h-5 rounded-full object-cover mx-2 flex-shrink-0"
                />

                <span className="text-gray-800 text-sm font-medium">
                  {user.userName}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Button */}

        <div className="px-5 py-4 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-sm rounded-md shadow-md transition duration-200"
          >
            CHỌN
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignRoleModal;
