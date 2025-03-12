import React from "react";
import styles from "./ContactCard.module.scss";

const ContactCard = ({ onClose }) => {
  return (
    <div className={styles.container}>
      <div className={styles.closeIcon} onClick={onClose}>
        X
      </div>
      <div className={styles.contactItem}>
        <img
          src="image\f8ad738c648cb0c7cc815d6ceda805b0.png"
          alt="avatar"
          className={styles.icon}
        />
        <span className={styles.text}>Nguyễn Đình Minh</span>
      </div>

      <div className={styles.contactItem}>
        <img
          src="image\phone.png"
          alt="phone"
          className={styles.icon}
        />
        <span className={styles.text}>0913310193</span>
      </div>

      <div className={styles.contactItem}>
        <img
          src="image\Email.png"
          alt="email"
          className={styles.icon}
        />
        <span className={styles.text}>minhnd@lifetek.vn</span>
      </div>
    </div>
  );
};

export default ContactCard;
