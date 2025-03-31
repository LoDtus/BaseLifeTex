import { useState } from "react";
import styles from "./ProjectCard.module.scss";
import Popover from "@mui/material/Popover";
import ContactCard from "../contactCard/ContactCard";
import { toolCvStatus } from "../../tools/toolsCvStatus";
import { toolsCvDateYMD } from "../../tools/toolsCvDate";
import { useDispatch } from "react-redux";
import { deleteProject } from "../../redux/projectSlice";

const ProjectCard = ({ project }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const getStatusButtonClass = () => {
    switch (toolCvStatus(project.status)) {
      case "Đang thực hiện":
        return styles.statusBtnInProgress;
      case "Chưa hoàn thành":
        return styles.statusBtnNotCompleted;
      case "Đã Hoàn thành":
        return styles.statusBtnCompleted;
      default:
        return styles.statusBtnNotCompleted; // Default to "Chưa hoàn thành"
    }
  };
  const handleClick = (event) => {
    event.stopPropagation(); // Ngăn chặn sự kiện lan lên cha
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const handleClose = (event) => {
    event.stopPropagation(); // Ngăn chặn sự kiện lan lên cha
    setAnchorEl(null);
  };
  const handleDelete = () => {
    if (!project?._id) {
      console.error("Lỗi: projectId không hợp lệ!", project);
      return;
    }
  
    if (window.confirm("Bạn có chắc chắn muốn xóa dự án này?")) {
      dispatch(deleteProject(project._id));
    }
  };
  
  
  return (
    <div className={styles.projectCard}>
      <div className={styles.projectHeader}>
        <div className={styles.right}>
          <h1 className={styles.nameProject} title={project.name}>
            {project.name}
          </h1>
          <p className={styles.projectId} title={project.code}>
            <strong>Mã dự án:</strong> {project.code}
          </p>
        </div>
        <div className={styles.projectDates}>
          <p>
            <span>Ngày bắt đầu:</span>
            <span className={styles.date}>
              {toolsCvDateYMD(project.createdAt)}
            </span>
          </p>
          <p className={styles.endDate}>
            <span>Ngày kết thúc:</span>
            <span className={styles.date}>
              {toolsCvDateYMD(project.updatedAt)}
            </span>
          </p>
        </div>
      </div>
      <div className={styles.projectResponsible}>
        <div>
          <strong>Người phụ trách</strong>

          <div className={styles.responsibleInfo}>
            <span title={project.managerId?.userName}>
              {project.managerId?.userName}
            </span>
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
        <button className={styles.deleteBtn} onClick={handleDelete}>
          Xóa
        </button>
        <button
          style={{
            borderRadius: 20,
          }}
          className={getStatusButtonClass()}
        >
          {toolCvStatus(project.status)}
        </button>
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <ContactCard onClose={handleClose} contact={project.managerId} />
      </Popover>
    </div>
  );
};

export default ProjectCard;
