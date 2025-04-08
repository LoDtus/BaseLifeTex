import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserInfo } from '../../services/authService';
import { toast } from 'react-toastify';

export default function UpdateUserForm({ onClose }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.login.currentUser.data.user);
  const accessToken = useSelector(state => state.auth.login.currentUser.data.accessToken);
  const isUpdating = useSelector(state => state.auth.login.isFetching);

  const [formData, setFormData] = useState({
    avatar: user.avatar || '',
    userName: user.userName || '',
    phone: user.phone || '',
  });

  const [preview, setPreview] = useState(user.avatar);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar') {
      if (files && files[0]) {
        setFormData({ ...formData, avatar: files[0] });
        setPreview(URL.createObjectURL(files[0])); // Hiển thị ảnh preview
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedFormData = new FormData();
    updatedFormData.append("userName", formData.userName);
    updatedFormData.append("phone", formData.phone);
    if (formData.avatar instanceof File) {
      updatedFormData.append("avatar", formData.avatar); // Nếu là file mới
    }
  
    console.log("🔍 FormData chuẩn bị gửi lên:");
    for (let pair of updatedFormData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
  
    try {
      console.log("🚀 Dispatching updateUserInfo...");
      const res = await dispatch(updateUserInfo({ data: updatedFormData, accessToken }));
  
      if (res.payload?.data) {
        toast.success("Cập nhật thành công!");
        onClose();
      } else {
        toast.error("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("❌ Dispatch thất bại:", error);
      toast.error("Lỗi khi cập nhật!");
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="update-form">
      <h2>Cập nhật thông tin</h2>

      <div className="form-group">
        {preview && (
          <img src={preview} alt="avatar preview" className="avatar-preview" />
        )}
        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleChange}
        />
      </div>

      <input
        type="text"
        name="userName"
        value={formData.userName}
        onChange={handleChange}
        placeholder="Tên người dùng"
        required
      />

      <input
        type="text"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Số điện thoại"
        required
      />
<button type="submit" disabled={isUpdating}>
  {isUpdating ? 'Đang lưu...' : 'Lưu'}
</button>

    </form>
  );
}