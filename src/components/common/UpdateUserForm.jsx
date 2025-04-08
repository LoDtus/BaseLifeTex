import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { updateUserInfo } from '@/redux/userSlice';
import { toast } from 'react-toastify';

export default function UpdateUserForm({ onClose }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.login.currentUser.data.user);
  const accessToken = useSelector(state => state.auth.login.currentUser.data.accessToken);

  const [formData, setFormData] = useState({
    avatar: user.avatar,
    userName: user.userName,
    phone: user.phone,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar') {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserInfo({ updatedData: formData, accessToken })).unwrap();
      toast.success('Cập nhật thông tin thành công!');
      onClose();
    } catch (err) {
      toast.error('Cập nhật thất bại!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="update-form">
      <h2>Cập nhật thông tin</h2>
      {formData.avatar && (
  <img
    src={formData.avatar}
    alt="avatar preview"
    className="user-avatar"
    style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%', margin: '0 auto' }}
  />
)}
      <input type="file" name="avatar" onChange={handleChange} />
      <input type="text" name="userName" value={formData.userName} onChange={handleChange} placeholder="Tên người dùng" />
      <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Số điện thoại" />
      <button type="submit">Lưu</button>
    </form>
  );
}
