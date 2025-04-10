import React, { useState } from "react";
import "./styles/UserModal.scss";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SaveIcon from "@mui/icons-material/Save";
import { ROLE_LABELS } from "../common/js/roles";
import UserFormFields from "./UserFormFields";
import { useDispatch, useSelector } from 'react-redux';
import { updateUserInfo } from '../../services/authService'; // điều chỉnh path nếu cần
import { toast } from 'react-toastify';
function UserModal({ user, onClose }) {
  const [previewAvatar, setPreviewAvatar] = useState(user.avatar);

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    ...user,
    roleLabel: ROLE_LABELS[user.role],
  });

  const dispatch = useDispatch();
const accessToken = useSelector((state) => state.auth.login.currentUser?.data?.accessToken);

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedUser({ ...editedUser, avatar: file }); // Lưu file thật để gửi đi
      setPreviewAvatar(URL.createObjectURL(file)); // Hiển thị ảnh mới ngay
    }
  };  
  
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("userName", editedUser.userName);
    formData.append("email", editedUser.email);
    formData.append("phone", editedUser.phone);
  
    if (editedUser.avatar instanceof File) {
      formData.append("avatar", editedUser.avatar);
    }
  
    try {
      await dispatch(updateUserInfo({ data: formData, accessToken }));
      toast.success("Cập nhật thành công!");
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error("Cập nhật thất bại.");
    }
  };
  
  
  return (
    <div className="fixed-user-card">
      <UserFormFields
        user={editedUser}
        isEditing={isEditing}
        onChange={handleChange}
        onAvatarChange={handleAvatarChange}
        previewAvatar={previewAvatar}
      />

      <div className="modal-actions">
        {isEditing ? (
          <button className="save-btn" onClick={handleSave}>
            <SaveIcon /> Lưu
          </button>
        ) : (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            <EditNoteIcon /> Sửa
          </button>
        )}
        <button className="close-btn" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
}

export default UserModal;
