import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import styles from "./styles/Navbar.module.scss";
import ProjectCard from "./components/ProjectCard";
import Loading from "@/components/common/Loading";
import { useDispatch, useSelector } from "react-redux";
import { getListProjectByUser, setSelectedProject } from "@/redux/projectSlice";
import AddProjectModal from "./components/AddProjectModal";

export default function NavigationBar({ searchTerm }) {
  const lstProject = useSelector((state) => state.project.listProject);
  const selectedProjectId = useSelector((state) => state.project.selectedProjectId);
  const [loading, setLoading] = useState(true); // State for loading
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigate
  const dispatch = useDispatch();
  const fetchProjects = async () => {
    setLoading(true); // Start loading
    try {
      dispatch(getListProjectByUser());
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleProjectClick = (projectId) => {
    dispatch(setSelectedProject(projectId));
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("idProject", projectId); // Add or update idProject in URL
    navigate(`${currentUrl.pathname}${currentUrl.search}`); // Navigate to the updated URL
  };
  // <<<<<<< HEAD

  //   useEffect(() => {
  //     fetchProjects();
  //   }, []);
  // =======
  // >>>>>>> BaseLifeTex_ducthanhdev

  const handleAddProjectClick = () => {
    setIsAddProjectModalOpen(true); // Mở modal khi nút được click
  };

  const handleCloseAddProjectModal = () => {
    setIsAddProjectModalOpen(false); // Đóng modal
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (lstProject.length > 0) {
      const firstProjectId = lstProject[0]._id;
      dispatch(setSelectedProject(firstProjectId));
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("idProject", firstProjectId);
      navigate(`${currentUrl.pathname}${currentUrl.search}`);
    }
  }, [lstProject, dispatch, navigate]);

  useEffect(() => {
    if (lstProject.length > 0) {
      const firstProjectId = lstProject[0]._id;
      dispatch(setSelectedProject(firstProjectId));
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("idProject", firstProjectId);
      navigate(`${currentUrl.pathname}${currentUrl.search}`);
    }
  }, [lstProject, dispatch, navigate]);

  const removeAccents = (str) => {
    return str
      ? str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
      : "";
  };

  const filteredProjects = lstProject?.filter((project) => {
    const projectName = removeAccents(project?.name);
    const searchKeyword = removeAccents(searchTerm);

    // Nếu không có từ khóa tìm kiếm, hiển thị tất cả dự án
    return searchKeyword ? projectName.includes(searchKeyword) : true;
  });

  return (
    <div className={styles.navbar}>
      <div className={styles.headerNavbar}>
        <div className={styles.icon}>
          <svg
            width="27"
            height="30"
            viewBox="0 0 27 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_13_251)">
              <path
                d="M23.8359 7.03125V0H3.16406V3.51562H0V26.4844H3.16406V30H23.8359V26.4844H27V7.03125H23.8359ZM3.16406 24.7266H1.58203V8.78906H3.16406V24.7266ZM3.16406 7.03125H1.58203V5.27344H3.16406V7.03125ZM22.2539 28.2422H18.6265L22.2539 24.2117V28.2422ZM17.5078 26.9992V22.9688H21.1353L17.5078 26.9992ZM22.2539 21.2109H15.9258V28.2422H4.74609V1.75781H22.2539V21.2109ZM25.418 24.7266H23.8359V8.78906H25.418V24.7266Z"
                fill="#579AD7"
              />
              <path
                d="M19.0898 10.6055H7.91016V12.3633H19.0898V10.6055Z"
                fill="#579AD7"
              />
              <path
                d="M19.0898 14.1211H7.91016V15.8789H19.0898V14.1211Z"
                fill="#579AD7"
              />
              <path
                d="M19.0898 7.08984H7.91016V8.84766H19.0898V7.08984Z"
                fill="#579AD7"
              />
            </g>
            <defs>
              <clipPath id="clip0_13_251">
                <rect width="27" height="30" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className={styles.projectListTitle}>
          Danh sách dự án tham gia
          <span className={styles.notificationBadge}>
            {filteredProjects.length}
          </span>
        </div>
      </div>
      <div className='py-2 px-3 mb-1 flex justify-center items-center border-1 border-dashed rounded-md font-semibold text-dark-gray
        cursor-pointer duration-200 hover:border-black hover:text-black active:scale-90'
        onClick={handleAddProjectClick}>
        <svg className='w-[20px] h-[20px] aspect-square !mr-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/>
        </svg>
        Thêm dự án
      </div>
      <div className={styles.bodyNavbar}>
        {loading ? (
          <Loading />
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <div
              key={index}
              onClick={() => handleProjectClick(project._id)}
              style={{ cursor: "pointer" }}
            >
              <ProjectCard
                project={project}
                isSelected={selectedProjectId === project._id}
              />
            </div>
          ))
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              height: "50px",
              borderTop: "1px solid black",
              paddingTop: "12px",
            }}
          >
            <p style={{ color: "black" }}>Bạn chưa thuộc dự án nào</p>
          </div>
        )}
      </div>
      {isAddProjectModalOpen && (
        <AddProjectModal onClose={handleCloseAddProjectModal} />
      )}
    </div>
  );
};
