import React, { useState } from "react";
import "./styles/UserModal.scss";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SaveIcon from "@mui/icons-material/Save";
import { ROLE_LABELS } from "../common/js/roles";

function UserModal({ user, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Đã lưu:", editedUser);
    setIsEditing(false);
  };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser({ ...editedUser, avatar: reader.result }); // Hiển thị ảnh mới
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed-user-card">
      <div className="card-header">
        <label className="avatar-upload">
          <img src={editedUser.avatar} alt="avatar" className="avatar" />
          {isEditing && (
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          )}
        </label>
        <div>
          {isEditing ? (
            <input
              type="text"
              name="userName"
              value={editedUser.userName}
              onChange={handleChange}
              className="input-edit"
            />
          ) : (
            <h3>{user.userName}</h3>
          )}
          <p className="role">{ROLE_LABELS[user.role]}</p>
        </div>
      </div>

      <div className="card-info">
        <p>
          <strong>Email:</strong>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={editedUser.email}
              onChange={handleChange}
              className="input-edit"
            />
          ) : (
            ` ${user.email}`
          )}
        </p>
        <p>
          <strong>Phone:</strong>
          {isEditing ? (
            <input
              type="text"
              name="phone"
              value={editedUser.phone}
              onChange={handleChange}
              className="input-edit"
            />
          ) : (
            ` ${user.phone}`
          )}
        </p>
      </div>

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
