import React, { useState } from "react";
import "./styles/UserModal.scss";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SaveIcon from "@mui/icons-material/Save";
import { ROLE_LABELS } from "../common/js/roles";
import UserFormFields from "./UserFormFields";
import { useDispatch, useSelector } from "react-redux";
import { updateUserInfo } from "../../services/authService"; // điều chỉnh path nếu cần
import { toast } from "react-toastify";
import { isValidEmail, isValidPhone } from "../../utils/validationUtils";
function UserModal({ user, onClose }) {
  const [previewAvatar, setPreviewAvatar] = useState(
    user.avatar ||
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    ...user,
    roleLabel: ROLE_LABELS[user.role],
  });
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state) => state.auth.login.currentUser?.data?.accessToken
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });

    if (name === "email") {
      setEmailError(isValidEmail(value) ? "" : "Email không hợp lệ");
    }

    if (name === "phone") {
      setPhoneError(isValidPhone(value) ? "" : "Số điện thoại không hợp lệ");
    }
  };
  // console.log(editedUser);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedUser({ ...editedUser, avatar: file }); // Lưu file thật để gửi đi
      setPreviewAvatar(URL.createObjectURL(file)); // Hiển thị ảnh mới ngay
    }
  };

  const handleSave = async () => {
    // Kiểm tra lại trước khi submit
    const isEmailValid = isValidEmail(editedUser.email);
    const isPhoneValid = isValidPhone(editedUser.phone);

    setEmailError(isEmailValid ? "" : "Email không hợp lệ");
    setPhoneError(isPhoneValid ? "" : "Số điện thoại không hợp lệ");

    if (!isEmailValid || !isPhoneValid) {
      toast.error("Vui lòng kiểm tra lại thông tin.");
      return;
    }
    const formData = new FormData();
    formData.append("userName", editedUser.userName);
    formData.append("email", editedUser.email);
    formData.append("phone", editedUser.phone);

    if (editedUser.avatar instanceof File) {
      formData.append("avatar", editedUser.avatar);
    }

    try {
      const res = await dispatch(
        updateUserInfo({ data: formData, accessToken })
      );

      if (res.payload.success === true) {
        toast.success("Cập nhật thành công!");
        setIsEditing(false);
      } else {
        toast.error("Cập nhật thất bại!");
      }
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
        emailError={emailError}
        phoneError={phoneError}
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
