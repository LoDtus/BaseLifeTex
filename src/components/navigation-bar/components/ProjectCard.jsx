import { useState } from "react";
import styles from "../styles/ProjectCard.module.scss";
import Popover from "@mui/material/Popover";
import ContactCard from "./ContactCard";
import { convertStatus, convertDateYMD } from "@/utils/convertUtils";
import { useDispatch } from "react-redux";
import { deleteProject } from "@/redux/projectSlice";
import { useSelector } from "react-redux";
import TotalProjectMember from "./TotalProjectMember";

const ProjectCard = ({ project, isSelected, avatarManger }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  const user = useSelector((state) => state.auth.login.currentUser);
  const userRole = useSelector((state) => state.auth.login.role);

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
      // eslint-disable-next-line no-console
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
        <img className={styles.avatarUser} src={user.data.user.avatar} alt="" />

        <span>{renderProjectMembersBubble({ idProject: project._id })}</span>
      </div>
      <div className={styles.projectFooter}>
        <img
          className={styles.avatar}
          src={project.managerId?.avatar}
          onClick={handleClick}
          alt="Avatar"
        />
        <div className="relative w-[35px] h-[20px]">
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="w-[20px] h-[20px] aspect-square absolute right-0"
          >
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
          </svg>
        </div>

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
