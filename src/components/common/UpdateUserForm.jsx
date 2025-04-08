import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserInfo } from '../../services/authService';
import { toast } from 'react-toastify';

export default function UpdateUserForm({ onClose }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [formData, setFormData] = useState({
    userName: user.userName || '',
    phone: user.phone || '',
    avatar: null,
  });

  const [preview, setPreview] = useState(user.avatar);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar') {
      const file = files[0];
      if (file) {
        setFormData({ ...formData, avatar: file });
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('userName', formData.userName);
    data.append('phone', formData.phone);
    if (formData.avatar) {
      data.append('avatar', formData.avatar);
    }

    try {
      await dispatch(updateUserInfo({ data, accessToken })).unwrap();
      toast.success('Cập nhật thành công!');
      onClose();
    } catch (err) {
      toast.error('Cập nhật thất bại!');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="update-form">
      <h2>Cập nhật thông tin</h2>

      <div className="form-group">
        {preview && <img src={preview} alt="avatar preview" className="avatar-preview" />}
        <input type="file" name="avatar" accept="image/*" onChange={handleChange} />
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

      <button type="submit">Lưu</button>
    </form>
  );
}
