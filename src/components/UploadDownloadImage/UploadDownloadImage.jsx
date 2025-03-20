import React, { useState } from "react";
import styles from "./UploadDownloadImage.module.scss";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const UploadImageButton = ({ onImageChange }) => {
  const [urlImage, setUrlImage] = useState();
  const [localImage, setLocalImage] = useState();

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUrlImage(imageUrl); // Lưu URL ảnh vào state
      setLocalImage(file); // Lưu file ảnh vào state
      onImageChange(file); // Gọi callback để cập nhật ảnh trong IssueForm
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="file"
        accept="image/*"
        id="fileInput"
        className={styles.input}
        onChange={handleUpload}
      />
      <label htmlFor="fileInput">
        <img
          src="image/downLoad.png"
          alt="Chọn ảnh"
          className={styles.uploadButton}
        />
      </label>
      {localImage && (
        <Zoom>
          <img
            src={urlImage}
            alt="Uploaded"
            className={styles.image}
            style={{ cursor: "pointer" }}
          />
        </Zoom>
      )}
    </div>
  );
};

export default UploadImageButton;
