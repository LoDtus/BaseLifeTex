import React, { useState } from 'react';
import './styles/UserModal.scss';
import UpdateUserForm from './UpdateUserForm';

function UserModal({ user, onClose }) {
    const [activeTab, setActiveTab] = useState('info');

    if (!user) return null;
    const roleMap = {
        0: 'PM',
        1: 'DEV',
        2: 'TEST',
        3: 'BA',
        4: 'USER',
      };
      

    return (
        <div className="user-modal">
            <div className="user-modal-content">
                <button className="close-btn" onClick={onClose}>X</button>
                <div className="tab-buttons">
                    <button
                        className={activeTab === 'info' ? 'active' : ''}
                        onClick={() => setActiveTab('info')}
                    >
                        Thông tin cá nhân
                    </button>
                    <button
                        className={activeTab === 'update' ? 'active' : ''}
                        onClick={() => setActiveTab('update')}
                    >
                        Cập nhật thông tin
                    </button>
                </div>

                {activeTab === 'info' ? (
                    <div className="tab-content">
                        <div>
                            <h2>{user.userName}</h2>
                            <img src={user.avatar} alt="avatar" className="user-avatar" />
                        </div>
                        <div>
                            <p>Email: {user.email}</p>
                            <p>Phone: {user.phone}</p>
                            <p>Role: {roleMap[user.role] || 'Không xác định'}</p>
                            <p>Created At: {new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                ) : (
                    <UpdateUserForm user={user} onClose={onClose} />
                )}
            </div>
        </div>
    );
}

export default UserModal;
