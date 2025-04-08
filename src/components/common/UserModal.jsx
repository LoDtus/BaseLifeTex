import React, { useState } from 'react';
import './styles/UserModal.scss';
import UpdateUserForm from './UpdateUserForm';

function UserModal({ user, onClose }) {
    const [activeTab, setActiveTab] = useState('info');

    if (!user) return null;

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
                        <h2>{user.userName}</h2>
                        <img src={user.avatar} alt="avatar" className="user-avatar" />
                        <p>Email: {user.email}</p>
                        <p>Phone: {user.phone}</p>
                    </div>
                ) : (
                    <UpdateUserForm user={user} onClose={onClose} />
                )}
            </div>
        </div>
    );
}

export default UserModal;
