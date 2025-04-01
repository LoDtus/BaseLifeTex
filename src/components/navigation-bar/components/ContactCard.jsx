import React from "react";
import styles from "../styles/ContactCard.module.scss";

const ContactCard = ({ onClose, contact }) => {
  return (
    <div className={styles.container}>
      <div className={styles.closeIcon} onClick={onClose}>
        <img
          style={{
            width: "16px",
          }}
          src="image\X.png"
          alt="avatar"
        />
      </div>
      <div className={styles.contactItem}>
        <img
          src="image\f8ad738c648cb0c7cc815d6ceda805b0.png"
          alt="avatar"
          className={styles.icon}
        />
        <span className={styles.text}>{contact?.userName}</span>
      </div>

      <div className={styles.contactItem}>
        <img src="image\phone.png" alt="phone" className={styles.icon} />
        <span className={styles.text}>{contact?.phone}</span>
      </div>

      <div className={styles.contactItem}>
        <img src="image\Email.png" alt="email" className={styles.icon} />
        <span className={styles.text}>{contact?.email}</span>
      </div>
    </div>
  );
};

export default ContactCard;
