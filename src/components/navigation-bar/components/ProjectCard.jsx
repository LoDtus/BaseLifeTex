import { useState } from "react";
import styles from "../styles/ProjectCard.module.scss";
import Popover from "@mui/material/Popover";
import ContactCard from "./ContactCard";
import { convertStatus, convertDateYMD } from "@/utils/convertUtils";
import { useDispatch } from "react-redux";
import { deleteProject } from "@/redux/projectSlice";
import { useSelector } from "react-redux";
import TotalProjectMember from "./TotalProjectMember";

const ProjectCard = ({ project, isSelected }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  const user = useSelector((state) => state.auth.login.currentUser);
  const userRole = useSelector((state) => state.auth.login.role);
  //   console.log("role:", userRole);
  const avatar =
    user?.data?.user?.avatar ||
    "data:image/png;base64,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";

  const getStatusButtonClass = () => {
    switch (convertStatus(project.status)) {
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
  const renderProjectMembersBubble = ({ idProject }) => {
    return <TotalProjectMember idProject={idProject} />;
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
    <div
      className={`${styles.projectCard} ${isSelected ? styles.selected : ""}`}
    >
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
              {convertDateYMD(project.createdAt)}
            </span>
          </p>
          <p className={styles.endDate}>
            <span>Ngày kết thúc:</span>
            <span className={styles.date}>
              {convertDateYMD(project.updatedAt)}
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
        <img className={styles.avatar} src="/imgs/image_5.png" alt="" />
        <span>{renderProjectMembersBubble({ idProject: project._id })}</span>
      </div>
      <div className={styles.projectFooter}>
        <img onClick={handleClick} src="/imgs/image_6.png" alt="" />
        <button
          style={{
            borderRadius: 20,
            marginLeft: "auto",
          }}
          className={getStatusButtonClass()}
        >
          {convertStatus(project.status)}
        </button>
        {userRole === 0 && (
          <button className={styles.buttonDelete} onClick={handleDelete}>
            <img
              src="/icons/trash-icon.png"
              alt=""
              style={{ width: "28.5px" }}
            />
          </button>
        )}
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
