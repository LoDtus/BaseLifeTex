import React, { useState } from "react";
import styles from "./UploadDownloadImage.module.scss";

const UploadImageButton = ({ onImageSelect }) => {
  const [image, setImage] = useState(null);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      onImageSelect(imageUrl); // Truyền file ảnh lên component cha
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
      {image && <img src={image} alt="Uploaded" className={styles.image} />}
    </div>
  );
};

export default UploadImageButton;
