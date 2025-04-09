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
  searchTasksInProject,
  getListTaskByProjectId,
} from "@/redux/taskSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setOpenProjectMenu } from "@/redux/propertiesSlice";

export default function Home() {
  const dispatch = useDispatch();
  let Page = useSelector((state) => state.task.page);
  let Limit = useSelector((state) => state.task.limit);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchParams] = useSearchParams();
  const idProject = searchParams.get("idProject") || "";
  const [viewMode, setViewMode] = useState("kanban");
  const [nameProject, setNameProject] = useState("Phần mềm đánh giá"); // Giá trị mặc định
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const [listMember, setListMember] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [timer, setTimer] = useState(null);
  const openProjectMenu = useSelector(
    (state) => state.properties.openProjectMenu
  );

  useEffect(() => {
    if (!idProject) return;
    if (timer) clearTimeout(timer);
    const newTimer = setTimeout(() => {
      dispatch(
        searchTasksInProject({
          keyword,
          idProject,
          limit: viewMode === "list" ? 20 : 100,
        })
      );
    }, 100);
    setTimer(newTimer);
    return () => clearTimeout(newTimer);
  }, [keyword, idProject, dispatch, viewMode]);

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
        setSelectedTasks([]);
        dispatch(
          getListTaskByProjectId({
            projectId: idProject,
            page: Page,
            limit: viewMode === "list" ? 20 : 100,
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

  const openFilter = Boolean(anchorElFilter);
  const openMember = Boolean(anchorEl);
  const filterId = openFilter ? "filter-popover" : undefined;
  const memberId = openMember ? "member-popover" : undefined;

  return (
    <div className="home-container">
      {/* Header Section */}
      <div className="px-1 pt-2">
        <div className="flex">
          <div
            className="w-[30px] h-[30px] p-2 rounded-md border border-gray-border flex justify-center items-center
                        cursor-pointer duration-200 hover:bg-[#f0f0f4] active:scale-90"
            onClick={() => dispatch(setOpenProjectMenu(!openProjectMenu))}
          >
            {openProjectMenu && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
              </svg>
            )}
            {!openProjectMenu && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M64 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM64 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48-208a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z" />
              </svg>
            )}
          </div>
          <div className="project-info !ml-3 grow">
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
      <div className="flex px-1">
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
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <div className="avatar-group">
            {listMember?.slice(0, 5)?.map((member, index) => (
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
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  key={index}
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  className="avatar"
                />
              ))}
          </div>
        </div>
        <div className="grow"></div>
        <Popover
          id={memberId}
          open={openMember}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          sx={{ mt: 1 }}
        >
          <MemberListContent
            onClose={() => setAnchorEl(null)}
            members={listMember}
          />
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

      {/* Content Section */}
      <div className="content-section">
        {viewMode === "kanban" ? (
          <KanbanBoard
            setSelectedTasks={setSelectedTasks}
            selectedTasks={selectedTasks}
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
