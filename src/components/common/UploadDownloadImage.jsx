import React, { useState } from "react";
import styles from "./styles/UploadDownloadImage.module.scss";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const UploadImageButton = ({ onImageChange, Image = null }) => {
  const [urlImage, setUrlImage] = useState(Image);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUrlImage(imageUrl || null); // Đảm bảo không truyền chuỗi rỗng
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
      {urlImage && (
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
