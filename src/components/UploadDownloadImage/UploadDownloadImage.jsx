import React, { useState } from "react";
import styles from "./UploadDownloadImage.module.scss";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const UploadImageButton = ({ image, setImage, setImageFile }) => {
  const handleUpload = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div className={styles.container}>
      {/* Ẩn input file */}
      <input
        type="file"
        accept="image/*"
        id="fileInput"
        className={styles.input}
        onChange={handleUpload}
      />
      {/* Hình ảnh thay thế cho button chọn ảnh */}
      <label htmlFor="fileInput">
        <img
          src="image/downLoad.png" // Thay bằng icon của bạn
          alt="Chọn ảnh"
          className={styles.uploadButton}
        />
      </label>
      {/* Hiển thị ảnh đã chọn */}
      {image && (
        <Zoom>
          <img
            src={image}
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
