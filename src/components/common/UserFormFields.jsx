import React from 'react';
 
 const UserFormFields = ({ user, isEditing, onChange, onAvatarChange, previewAvatar }) => {
     return (
         <>
           <div className="card-header">
             <label className="avatar-upload">
               <img src={previewAvatar || user.avatar} alt="avatar" className="avatar" />
               {isEditing && (
                 <input
                   type="file"
                   accept="image/*"
                   name="avatar"
                   onChange={onAvatarChange}
                   style={{ display: 'none' }}
                 />
               )}
             </label>
             <div>
               {isEditing ? (
                 <input
                   type="text"
                   name="userName"
                   value={user.userName}
                   onChange={onChange}
                   className="input-edit"
                 />
               ) : (
                 <h3>{user.userName}</h3>
               )}
               <p className="role">{user.roleLabel}</p>
             </div>
           </div>
     
           <div className="card-info">
             <p>
               <strong>Email:</strong>{" "}
               {isEditing ? (
                 <input
                   type="email"
                   name="email"
                   value={user.email}
                   onChange={onChange}
                   className="input-edit"
                 />
               ) : (
                 user.email
               )}
             </p>
             <p>
               <strong>Phone:</strong>{" "}
               {isEditing ? (
                 <input
                   type="text"
                   name="phone"
                   value={user.phone}
                   onChange={onChange}
                   className="input-edit"
                 />
               ) : (
                 user.phone
               )}
             </p>
           </div>
         </>
       );
     };
 
 export default UserFormFields;
 