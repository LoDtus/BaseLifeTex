import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { updateIssueDataStatus } from "@/services/issueService";
import { getListTaskByProjectId, changePage } from "@/redux/taskSlice";
import { Popover } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import KabanDetail from "../task-details/TaskDetailView";
import MemberListContent from "./MemberList";
import MemberListContentAdd from "./MemberListAdd";
import TablePagination from "@mui/material/TablePagination";
import Loading from "@/components/common/Loading";
import IssueForm from "../form/IssueForm";
import { getMembers } from "../../../../services/projectService";
import { changeRowPerPage } from "@/redux/taskSlice";
import { convertDateYMD } from '@/utils/convertUtils';

export default function ListHome({ selectedTasks = [], setSelectedTasks }) {
    const [searchParams] = useSearchParams();
    const idProject = searchParams.get("idProject");
    const taskList = useSelector((state) => state.task.listTask);
    const [avatar, setAvatar] = useState([]);

    const dispatch = useDispatch();
    let Page = useSelector((state) => state.task.page);
    let limit = useSelector((state) => state.task.limit);
    let Total = useSelector((state) => state.task.total);

    const [loading, setLoading] = useState(false);

    const debouncedGetList = useCallback(async () => {
        setLoading(true);

        const response = await getMembers(idProject);
        response.map((e) => {
            setAvatar((prev) => [
                ...prev,
                {
                    id: e._id,
                    avatar: e.avatar,
                },
            ]);
        });

        try {
            await dispatch(
                getListTaskByProjectId({
                    projectId: idProject,
                    page: Page,
                    limit: 20,
                })
            );
        } catch (error) {
            toast.error("Tạo nhiệm vụ thất bại", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [idProject, Page, dispatch]);

    useEffect(() => {
        if (!idProject) return;
        dispatch(changeRowPerPage(20));
    }, [idProject, dispatch]);

    useEffect(() => {
        debouncedGetList();
    }, [limit, debouncedGetList]);

    const [anchorElMemberTask, setAnchorElMemberTask] = useState(null);
    const [anchorElMemberAdd, setAnchorElMemberAdd] = useState(null);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [openDetail, setOpenDetail] = useState(false);
    const [idOpenDetail, setIdOpenDetail] = useState(null);
    const [open, setOpen] = useState(false);

    const handleChangeRowsPerPage = (event) => {
        const newLimit = parseInt(event.target.value, 10);
        dispatch(changeRowPerPage(newLimit)); // Cập nhật Redux state
    };

    const handleStatusChange = async (taskId, oldStatus, newStatus) => {
        const newStatusNumber = Number(newStatus);
        try {
            const response = await updateIssueDataStatus(taskId, {
                oldStatus,
                newStatus: newStatusNumber,
            });

            if (response.success) {
                debouncedGetList();
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        } catch (e) {
            toast.error("Cập nhật trạng thái thất bại");
            throw new Error(e);
        }
    };

    const onOpenDetail = (taskId) => {
        setIdOpenDetail(taskId);
        setOpenDetail(true);
    };

    const closeDetail = () => {
        setIdOpenDetail(null);
        setOpenDetail(false);
    };

    const handleClickMemberTask = (event, taskId) => {
        event.stopPropagation();
        setSelectedTaskId(taskId);
        setAnchorElMemberTask(event.currentTarget);
    };

    const handleCloseMemberTask = () => {
        setAnchorElMemberTask(null);
        setSelectedTaskId(null);
    };

    const handleClickMemberAdd = (event, taskId) => {
        event.stopPropagation();
        setSelectedTaskId(taskId);
        setAnchorElMemberAdd(event.currentTarget);
    };

    const handleCloseMemberAdd = () => {
        setAnchorElMemberAdd(null);
        setAnchorElMemberTask(null); // Đặt lại anchorElMemberTask
        setSelectedTaskId(null);
    };

    const handleSelectTask = (taskId) => {
        const updatedSelection = selectedTasks.includes(taskId)
            ? selectedTasks.filter((id) => id !== taskId)
            : [...selectedTasks, taskId];
        setSelectedTasks(updatedSelection);
    };
    return (
        <div className="list-home-wrapper">
            <div className="w-fit py-1 px-5 mb-1 flex items-center border rounded-md font-semibold
                cursor-pointer duration-200 hover:bg-light-gray active:scale-90"
                onClick={() => setOpen(true)}
            >
                <svg className='w-[15px] h-[15px] aspect-square !mr-2'
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/>
                </svg>
                <span>Thêm công việc</span>
            </div>
                {loading ? (
                    <Loading />
                ) : (
                    <div>
                        <div className="flex items-center bg-[#f8fafc] border border-gray-border rounded-md py-1 mb-1 font-semibold text-dark-gray">
                            <span className='basis-[2%] flex justify-center items-center border-r border-gray-border'>
                                <input type='checkbox'/>
                            </span>
                            <span className='basis-[4%] flex justify-center items-center border-r border-gray-border'>STT</span>
                            <span className='basis-[30%] flex justify-center items-center border-r border-gray-border'>Tên công việc</span>
                            <span className='basis-[10%] flex justify-center items-center border-r border-gray-border'>Người nhận</span>
                            <span className='basis-[10%] flex justify-center items-center border-r border-gray-border'>Bắt đầu</span>
                            <span className='basis-[10%] flex justify-center items-center border-r border-gray-border'>Kết thúc</span>
                            <span className='basis-[15%] flex justify-center items-center border-r border-gray-border'>Trạng thái</span>
                            <span className='basis-[18%] flex justify-center items-center border-r border-gray-border'>Liên kết</span>
                            <span className='basis-[5%] flex justify-center items-center'>Xem</span>
                        </div>
                        <div className="border-t border-x border-gray-border rounded-md">
                            { taskList.map((task, i) => (
                                <div key={i} className='flex items-center border-b border-gray-border py-1 duration-200 hover:bg-light-gray'>
                                    <div className='basis-[2%] flex justify-center items-center'>
                                        <input type="checkbox"
                                            checked={selectedTasks.includes(task._id)}
                                            onChange={() => handleSelectTask(task._id)}
                                        />
                                    </div>
                                    <div className='basis-[4%] flex justify-center items-center text-dark-gray'>{(Page - 1) * limit + i + 1}</div>
                                    <div className='basis-[30%] line-clamp-2'>{ task.title }</div>
                                    <div className='basis-[10%] flex'>
                                        {task.assigneeId?.slice(0, 3).map((member) => {
                                            let srcImg = avatar.find((e) => e.id === member._id)?.avatar || '/path/to/default-avatar.jpg';
                                            return ( <img
                                                className='w-[25px] h-[25px] aspect-square rounded-full !mr-[2px]'
                                                src={srcImg}
                                                title={member.userName}
                                            />);
                                        })}
                                        {task.assigneeId?.length > 2 && (
                                            <div>
                                                <img
                                                    className='!w-[25px] !h-[25px] cursor-pointer duration-200 active:scale-90 !mr-1'
                                                    src="/icons/dot.png"
                                                    onClick={(e) => handleClickMemberTask(e, task._id)}
                                                />
                                                {selectedTaskId === task._id && (
                                                    <Popover
                                                        open={Boolean(anchorElMemberTask)}
                                                        anchorEl={anchorElMemberTask}
                                                        onClose={handleCloseMemberTask}
                                                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                                                        transformOrigin={{ vertical: "top", horizontal: "left" }}
                                                        sx={{ mt: 1 }}
                                                    >
                                                        <div className="all-member-in-task">
                                                            <MemberListContent
                                                                members={task.assigneeId}
                                                                onClose={handleCloseMemberTask}
                                                            />
                                                        </div>
                                                    </Popover>
                                                )}
                                            </div>
                                        )}
                                        <button className="w-[25px] h-[25px] aspect-square border !rounded-full cursor-pointer duration-200"
                                            onClick={(e) => handleClickMemberAdd(e, task._id)}>+</button>
                                        {selectedTaskId === task._id && (
                                            <Popover
                                                open={Boolean(anchorElMemberAdd)}
                                                anchorEl={anchorElMemberAdd}
                                                onClose={handleCloseMemberAdd}
                                                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                                                transformOrigin={{ vertical: "top", horizontal: "left" }}
                                                sx={{ mt: 1 }}
                                            >
                                                <MemberListContentAdd
                                                    onClose={handleCloseMemberAdd}
                                                    idProject={idProject}
                                                    task={task}
                                                    fetchApi={() => debouncedGetList()}
                                                    toast={toast}
                                                />
                                            </Popover>
                                        )}
                                    </div>
                                    <div className='basis-[10%] flex justify-center items-center text-dark-gray'>{ convertDateYMD(task.startDate) }</div>
                                    <div className='basis-[10%] flex justify-center items-center text-dark-gray'>{ convertDateYMD(task.endDate) }</div>
                                    <div className='basis-[15%] flex justify-center'>
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange( task._id, task.status, e.target.value )}
                                            className="status-select"
                                        >
                                            <option value={1}>Công việc mới</option>
                                            <option value={2}>Đang thực hiện</option>
                                            <option value={3}>Kiểm thử</option>
                                            <option value={4}>Hoàn thành</option>
                                            <option value={5}>Đóng công việc</option>
                                            <option value={6}>Tạm dừng</option>
                                            <option value={7}>Khóa công việc</option>
                                        </select>
                                    </div>
                                    <div className='basis-[18%] line-clamp-1'>
                                        <a href={`task.link`} target="_blank" rel="noopener noreferrer" className="text-blue">{ task.link }</a>
                                    </div>
                                    <div className='basis-[5%] flex justify-center'>
                                        <svg className='w-[15px] h-[15px] aspect-square text-dark-gray cursor-pointer duration-200 hover:text-black active:scale-90'
                                            onClick={() => onOpenDetail(task._id)}
                                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
                                        </svg>
                                        {idOpenDetail === task._id && (
                                            <KabanDetail
                                                open={openDetail}
                                                handleClose={closeDetail}
                                                task={task}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <TablePagination
                    component="div"
                    count={Total}
                    page={Page - 1} // Bắt đầu từ 1
                    onPageChange={(e, newPage) => dispatch(changePage(newPage))}
                    rowsPerPage={limit}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 20, 50]}
                    labelRowsPerPage="Số trang"
                />
            {open && <IssueForm
                isOpen={open}
                onClose={() => setOpen(false)}
            />}
        </div>
    );
};