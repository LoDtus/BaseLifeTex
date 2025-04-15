import React from "react";
import styles from "../styles/ContactCard.module.scss";
import { useSelector } from "react-redux";

const ContactCard = ({ onClose, contact }) => {
  const user = useSelector((state) => state.auth.login.currentUser);
  const avatar = user?.data?.user?.avatar || "/imgs/basic-user.png";

  return (
    <div className={styles.container}>
      <div className={styles.closeIcon} onClick={onClose}>
        <img
          style={{
            width: "16px",
          }}
          src="/icons/x-icon.png"
          alt="avatar"
        />
      </div>
      <div className={styles.contactItem}>
        <img
          src={
            contact?.avatar ||
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
          }
          alt="avatar"
          className={styles.icon}
        />
        <span className={styles.text}>{contact?.userName}</span>
      </div>

      <div className={styles.contactItem}>
        <img src="/icons/phone.png" alt="phone" className={styles.icon} />
        <span className={styles.text}>{contact?.phone}</span>
      </div>

      <div className={styles.contactItem}>
        <img src="/icons/email-icon.png" alt="email" className={styles.icon} />
        <span className={styles.text}>{contact?.email}</span>
      </div>
    </div>
  );
};

export default ContactCard;
