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
                <img
                    className="w-[40px] h-[40px] rounded-full aspect-square relative left-[25px]"
                    src={user.data.user.avatar}
                    alt=""
                />
                <span>{renderProjectMembersBubble({ idProject: project._id })}</span>
            </div>
            <div className={styles.projectFooter}>
                <img
                    className="w-[40px] h-[40px] aspect-square"
                    onClick={handleClick}
                    src={avatarManger}
                    alt=""
                />
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
