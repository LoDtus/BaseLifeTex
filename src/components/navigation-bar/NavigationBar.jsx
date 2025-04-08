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
        setLoading(true);
        try {
            dispatch(getListProjectByUser());
        } finally {
            setLoading(false);
        }
    };

    const handleProjectClick = (projectId) => {
        dispatch(setSelectedProject(projectId));
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("idProject", projectId); // Add or update idProject in URL
        navigate(`${currentUrl.pathname}${currentUrl.search}`); // Navigate to the updated URL
    };

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
        <div className='p-2'>
            <div className='w-full flex flex-col items-center flex-none'>
                <div className='flex items-center mb-2'>
                    <span className="font-semibold text-xl">CÁC DỰ ÁN</span>
                    <span className='w-[20px] h-[20px] !ml-1 aspect-square rounded-full text-white font-semibold p-1 text-[12px] bg-red flex justify-center items-center'>
                        {filteredProjects.length}
                    </span>
                </div>
                <button className="w-full mb-1 border-1 !border-dashed border-gray !rounded-md flex justify-center items-center py-2 px-3
                    text-dark-gray font-semibold
                    cursor-pointer duration-200 hover:shadow-md hover:border-black hover:text-black active:scale-90"
                    onClick={handleAddProjectClick}
                >
                    Thêm dự án mới
                </button>
            </div>
            <div className={styles.bodyNavbar}>
                {loading
                    ? (
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
