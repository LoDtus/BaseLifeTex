import React from 'react';
import './styles/UserModal.scss';

function UserModal({ user, onClose }) {
    if (!user) return null;

    return (
        <div className="user-modal">
            <div className="user-modal-content">
                <button className="close-btn" onClick={onClose}>X</button>
                <h2>{user.userName}</h2>
                <img src={user.avatar} alt="avatar" className="user-avatar" />
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
            </div>
        </div>
    );
}

export default UserModal;
