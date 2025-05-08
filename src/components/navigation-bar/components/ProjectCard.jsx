import { useEffect, useState } from "react";
import styles from "../styles/ProjectCard.module.scss";
import Popover from "@mui/material/Popover";
import ContactCard from "./ContactCard";
import { UserOutlined, SettingOutlined } from "@ant-design/icons";
import { convertStatus, convertDateYMD } from "@/utils/convertUtils";
import { useDispatch } from "react-redux";
import { deleteProject } from "@/redux/projectSlice";
import { useSelector } from "react-redux";
import TotalProjectMember from "./TotalProjectMember";
import ProjectDetailModal from "./ProjectDetails";
import Dialog from "@mui/material/Dialog";
import AddProjectModal from "./AddProjectModal";
import { toast } from "react-toastify";
import { getListProjectByUser } from "../../../redux/projectSlice";
import ConfirmDialog from "../../ConfirmDialog";
import { IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ProjectSettingPopover from "./ProjectSettingPopover";

const ProjectCard = ({ project, isSelected, avatarManger }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  const user = useSelector((state) => state.auth.login.currentUser?.data?.user);

  const userRole = useSelector((state) => state.auth.login.role);
  const [projectDetailModal, setProjectDetailModal] = useState(false);
  const [projectModal, setProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // New state for ConfirmDialog

  useEffect(() => {
    setProjectModal(false);
  }, [project]);
  const getStatusButtonClass = () => {
    switch (convertStatus(project.status)) {
      case "Đang thực hiện":
        return styles.statusBtnInProgress;

      case "Hoàn thành":
        return styles.statusBtnCompleted;
      // statusBtnNotCompleted;

      case "Chưa hoàn thành":
        return styles.statusBtnNotCompleted;

      default:
        return styles.statusBtnNotCompleted; // Default to "Chưa hoàn thành"
    }
  };
  const getStatusBackgroundClass = () => {
    switch (convertStatus(project.status)) {
      case "Đang thực hiện":
        return "inProgress"; // Trạng thái "Đang thực hiện"
      case "Hoàn thành":
        return "completed"; // Trạng thái "Hoàn thành"
      case "Chưa hoàn thành":
      default:
        return "notCompleted"; // Trạng thái "Chưa hoàn thành"
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

  const confirmDeleteProject = async () => {
    if (!project?._id) {
      console.error("Lỗi: projectId không hợp lệ!", project);
      return;
    }

    try {
      const result = await dispatch(deleteProject(project._id));

      if (deleteProject.rejected.match(result)) {
        toast.error(result.data || "Bạn không có quyền xóa project này");
        return;
      }

      toast.success("Xóa dự án thành công");
      await dispatch(getListProjectByUser(project._id));
      setOpenConfirmDialog(false);
    } catch (error) {
      toast.error("Xảy ra lỗi không xác định khi xóa dự án");
      console.error(error);
    }
  };
  const handleDelete = () => {
    setOpenConfirmDialog(true); // Open ConfirmDialog
  };

  const handleProjectDeatailClick = () => {
    setProjectDetailModal(true);
  };

  // ////////////////////////////////////////////////////////////////////////
  const [anchorElSetting, setAnchorElSetting] = useState(null);
  const openSetting = Boolean(anchorElSetting);

  const handleSettingClick = (event) => {
    event.stopPropagation(); // tránh ảnh hưởng sự kiện cha
    setAnchorElSetting(event.currentTarget);
  };

  const handleSettingClose = (event) => {
    event?.stopPropagation?.(); // tránh lỗi nếu gọi từ onClose mặc định
    setAnchorElSetting(null);
  };

  return (
    <>
      <div
        className={`${styles.projectCard} ${
          styles[getStatusBackgroundClass(project.status)]
        } ${isSelected ? styles.selected : ""}`}
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
                {convertDateYMD(project.startDate)}
              </span>
            </p>
            <p className={styles.endDate}>
              <span>Ngày kết thúc:</span>
              <span className={styles.date}>
                {convertDateYMD(project.endDate)}
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
            className={styles.avatarUser}
            src={
              user?.avatar ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
            }
            alt="Avatar"
          />

          <span>{renderProjectMembersBubble({ idProject: project._id })}</span>
        </div>
        <div className={styles.projectFooter}>
          <img
            className={styles.avatar}
            src={
              project?.managerId?.avatar ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
            }
            onClick={handleClick}
            alt="Avatar"
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
          {/* {userRole === 0 && (
            <button
              className={`${styles.buttonDelete} items-center`}
              onClick={handleDelete}
            >
              <img
                src="/icons/trash-icon.png"
                alt=""
                style={{ width: "98%", height: "98%" }}
              />
            </button>
          )} */}
          {user?._id &&
            project?.managerId?._id &&
            project.managerId._id === user._id && (
              <button
                className={`${styles.buttonDelete} items-center`}
                onClick={handleDelete}
              >
                <img
                  src="/icons/trash-icon.png"
                  alt="Xóa dự án"
                  style={{ width: "98%", height: "98%" }}
                />
              </button>
            )}

          {user?._id &&
            project?.managerId?._id &&
            project.managerId._id === user._id && (
              <div onClick={handleProjectDeatailClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-[24px] h-[24px] aspect-square relative top-0 left-1"
                >
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                </svg>
              </div>
            )}
          <IconButton
            size="small"
            aria-label="Cài đặt"
            className="p-0 h-[24px]"
            style={{ marginLeft: "8px" }}
            onClick={handleSettingClick}
          >
            <SettingsIcon sx={{ fontSize: 25 }} />
          </IconButton>
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
      <ProjectDetailModal
        project={project}
        open={projectDetailModal}
        onClose={() => setProjectDetailModal(false)}
        onEdit={() => {
          // Chỗ này bạn có thể gọi một modal/form edit khác
          setEditingProject(project?._id);
          setProjectDetailModal(false);
          setProjectModal(true);
        }}
      />
      <AddProjectModal
        open={projectModal}
        onClose={() => {
          setProjectModal(false);
          setEditingProject(null);
        }}
        projectData={editingProject}
        isUpdate={true}
        project={project}
      />
      <ConfirmDialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        onConfirm={confirmDeleteProject}
        title="Xác nhận xoá dự án"
        content={`Bạn có chắc chắn muốn xoá dự án "${project.name}" không?`}
      />
      <ProjectSettingPopover
        open={openSetting}
        anchorEl={anchorElSetting}
        onClose={handleSettingClose}
        onViewDetail={() => setProjectDetailModal(true)}
        onEdit={() => {
          setEditingProject(project?._id);
          setProjectModal(true);
        }}
        onDelete={() => setOpenConfirmDialog(true)}
      />
    </>
  );
};

export default ProjectCard;
