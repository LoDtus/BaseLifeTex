// src/pages/Home/Home.jsx
import { useCallback, useEffect, useState } from "react";
import "./Home.scss";
import { useSearchParams } from "react-router-dom";
import { Avatar, Popover } from "@mui/material";
import MemberListContent from "@/components/tasks/components/list-view/MemberList";
import KanbanBoard from "@/components/tasks/components/kanban-view/KanbanBoard";
import ListHome from "@/components/tasks/components/list-view/ListView";
import { getProjectId } from "@/services/projectService";
import { getlistUser } from "@/services/userService";
import FilterDialog from "@/components/tasks/FilterDialog";
import {
    deleteManyTasksRedux,
    getByIndexParanation,
} from "@/redux/taskSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Home() {
    const dispatch = useDispatch();
    let Page = useSelector((state) => state.task.page);
    let Limit = useSelector((state) => state.task.limit);
    let Total = useSelector((state) => state.task.total);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchParams] = useSearchParams();
    const idProject = searchParams.get("idProject") || "";
    const [viewMode, setViewMode] = useState("kanban");
    const [nameProject, setNameProject] = useState("Phần mềm đánh giá"); // Giá trị mặc định
    const [anchorElFilter, setAnchorElFilter] = useState(null);
    const [listMember, setListMember] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);

    const openFilter = Boolean(anchorElFilter);
    const openMember = Boolean(anchorEl);
    const filterId = openFilter ? "filter-popover" : undefined;
    const memberId = openMember ? "member-popover" : undefined;

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // useEffect(() => {
    //     const handler = setTimeout(() => {
    //         setDebouncedSearch(searchTerm.trim().toLowerCase());
    //     }, 200);

    //     return () => clearTimeout(handler);
    // }, [searchTerm]);

    const getMemberByProject = useCallback(async () => {
        const response = await getlistUser(idProject);
        if (response.success) {
            setListMember(response.data);
        }
    }, [idProject]);

    async function fetchProjectData(idPrj) {
        try {
            const response = await getProjectId(idPrj);
            if (response.success) {
                setNameProject(response.data.name);
            }
        } catch (error) {
            setNameProject("Phần mềm đánh giá");
            throw error;
        }
    }

    useEffect(() => {
        if (idProject) {
            fetchProjectData(idProject);
            getMemberByProject();
        }
    }, [idProject, getMemberByProject]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteSelected = async () => {
        if (selectedTasks.length === 0) {
            toast.warning("Vui lòng chọn vấn đề muốn xóa !");
            return;
        }

        // const confirmDelete = window.confirm(
        //   `Bạn có chắc muốn xóa ${selectedTasks.length} task không?`
        // );
        // if (!confirmDelete) return;

        try {
            const result = await dispatch(
                deleteManyTasksRedux(selectedTasks)
            ).unwrap();

            if (result && result.length > 0) {
                // alert("✅ Xóa thành công!");
                setSelectedTasks([]);
                dispatch(
                    getByIndexParanation({
                        projectId: idProject,
                        page: Page,
                        pageSize: Limit,
                    })
                );
                toast.success("Xóa thành công.");
            } else {
                toast.error("Xóa thất bại!");
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
            toast.error("Xóa thất bại!");
        }
    };

    return (
        <div className="home-container">
            {/* Header Section */}
            <div className="header-section">
                <div className="header-container">
                    <div className="project-info">
                        <p className="project-path">{nameProject}</p>
                    </div>
                    <div className="view-toggle">
                        <img
                            src="/icons/column-view.png"
                            alt="Kanban View"
                            className={`view-icon ${viewMode === "kanban" ? "active" : ""}`}
                            onClick={() => setViewMode("kanban")}
                        />
                        <img
                            src="/icons/list-view.png"
                            alt="List View"
                            className={`view-icon ${viewMode === "list" ? "active" : ""}`}
                            onClick={() => setViewMode("list")}
                        />
                    </div>
                </div>
            </div>

            {/* Toolbar Section */}
            <div className="toolbar-section">
                <div className="search-container">
                    <svg
                        className="search-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-4.35-4.35m2.6-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="avatar-group">
                        {listMember?.map((member, index) => (
                            <Avatar
                                key={index}
                                src={member.avatar}
                                alt={`Avatar ${index + 1}`}
                                className="avatar"
                            />
                        ))}
                        {listMember.length > 5 && 
                            ["icons/dot.png"].map((avatar, index) => (
                                <img
                                onClick={handleClick}
                                key={index}
                                src={avatar}
                                alt={`Avatar ${index + 1}`}
                                className="avatar"
                                />
                        ))}
                    </div>
                </div>

                <Popover
                    id={memberId}
                    open={openMember}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    sx={{ mt: 1 }}
                >
                    <MemberListContent onClose={handleClose} members={listMember} />
                </Popover>

                <div className="task-header">
                    <div className="task-icons">
                        <img
                            src="/icons/trash-icon.png"
                            alt="Delete"
                            className="tool-icon"
                            onClick={handleDeleteSelected}
                        />
                        <img
                            src="/icons/filter-icon.png"
                            alt="Filter"
                            className="tool-icon"
                            onClick={(e) => setAnchorElFilter(e.currentTarget)} // Mở Popover Filter
                            aria-describedby={filterId}
                        />
                        <Popover
                            id={filterId}
                            open={openFilter}
                            anchorEl={anchorElFilter}
                            onClose={() => setAnchorElFilter(null)}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                        >
                            <FilterDialog idProject={idProject} />
                        </Popover>
                    </div>
                </div>
            </div>

            <div></div>
            {/* Content Section */}
            <div className="content-section">
                {viewMode === "kanban" ? (
                    <KanbanBoard
                        setSelectedTasks={setSelectedTasks}
                        selectedTasks={selectedTasks}
                        searchTerm={searchTerm}
                    />
                ) : (
                    <ListHome
                        setSelectedTasks={setSelectedTasks}
                        selectedTasks={selectedTasks}
                    />
                )}
            </div>
        </div>
    );
}   