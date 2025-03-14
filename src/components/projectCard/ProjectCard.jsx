import { useState } from "react";
import styles from "./ProjectCard.module.scss";
import { Popper } from "@mui/base/Popper";
import ContactCard from "../contactCard/ContactCard";
import { toolCvStatus } from "../../tools/toolsCvStatus";
import { toolsCvDateYMD } from "../../tools/toolsCvDate";

const ProjectCard = ({ project }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  const getStatusButtonClass = () => {
    switch (toolCvStatus(project.status)) {
      case "Đang thực hiện":
        return styles.statusBtnInProgress;
      case "Chưa hoàn thành":
        return styles.statusBtnNotCompleted;
      case "Hoàn thành":
        return styles.statusBtnCompleted;
      default:
        return styles.statusBtnNotCompleted; // Default to "Chưa hoàn thành"
    }
  };

  return (
    <div className={styles.projectCard}>
      <div className={styles.projectHeader}>
        <div className={styles.right}>
          <h1 className={styles.nameProject}>{project.name}</h1>
          <p className={styles.projectId}>
            <strong>Mã dự án:</strong> {project._id}
          </p>
        </div>
        <div className={styles.projectDates}>
          <p>
            <strong>Ngày bắt đầu:</strong> {toolsCvDateYMD(project.createdAt)}
          </p>
          <p>
            <strong>Ngày kết thúc:</strong> {toolsCvDateYMD(project.updatedAt)}
          </p>
        </div>
      </div>
      <div className={styles.projectResponsible}>
        <div>
          <p>
            <strong>Người phụ trách</strong>
          </p>
          <div className={styles.responsibleInfo}>
            <span>{project.managerId?.userName}</span>
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
        <button className={getStatusButtonClass()}>
          {toolCvStatus(project.status)}
        </button>
      </div>
      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
        <div>
          <ContactCard onClose={handleClose} contact={project.managerId} />
        </div>
      </Popper>
    </div>
  );
};

export default ProjectCard;
