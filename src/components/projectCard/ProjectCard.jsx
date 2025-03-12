import { useState } from "react";
import styles from "./ProjectCard.module.scss";
import { Popper } from "@mui/base/Popper";
import ContactCard from "../contactCard/ContactCard";

const ProjectCard = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  return (
    <div className={styles.projectCard}>
      <div className={styles.projectHeader}>
        <div className={styles.right}>
          <h1 className={styles.nameProject}>Dự án Internal</h1>
          <p className={styles.projectId}>
            <strong>Mã dự án:</strong> 1234
          </p>
        </div>
        <div className={styles.projectDates}>
          <p>
            <strong>Ngày bắt đầu:</strong> 04/03/2025
          </p>
          <p>
            <strong>Ngày kết thúc:</strong> 05/07/2025
          </p>
        </div>
      </div>
      <div className={styles.projectResponsible}>
        <div>
          <p>
            <strong>Người phụ trách</strong>
          </p>
          <div className={styles.responsibleInfo}>
            <span>Nguyễn Đình Minh</span>
          </div>
        </div>
        <img
          className={styles.avatar}
          src="image/f8ad738c648cb0c7cc815d6ceda805b0.png"
          alt=""
        />
      </div>
      <div className={styles.projectFooter}>
        <img
          onClick={handleClick}
          src="image/e10ebdc6f22af020d1cdd58a063bf347.png"
          alt=""
        />
        <button className={styles.statusBtn}>Chưa hoàn thành</button>
      </div>
      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
        <div>
          <ContactCard onClose={handleClose} />
        </div>
      </Popper>
    </div>
  );
};

export default ProjectCard;
