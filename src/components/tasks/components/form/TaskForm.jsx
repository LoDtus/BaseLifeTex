import {
  Input,
  Dropdown,
  Button,
  DatePicker,
  Checkbox,
  Modal,
  message,
  Upload,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback, use, useRef } from "react";
import { useInputStates } from "@/hook/propertiesHook";
import { useSearchParams } from "react-router-dom";
import { setTaskForm } from "@/redux/propertiesSlice";
import { getMembers } from "@/services/projectService";
import { openSystemNoti } from "@/utils/systemUtils";
import { getTaskDetailById } from "@/services/taskService";
import { addTask, updateTask } from "@/services/taskService";

import "react-toastify/dist/ReactToastify.css";
const { TextArea } = Input;
import customParseFormat from "dayjs/plugin/customParseFormat";

import { getListTaskByProjectId } from "../../../../redux/taskSlice";
import Loading from "../../../common/Loading";
dayjs.extend(customParseFormat);
const dateFormat = "DD-MM-YYYY";

const priorityList = [
  { key: "0", label: <span>Thấp</span> },
  { key: "1", label: <span>Trung bình</span> },
  { key: "2", label: <span>Cao</span> },
];

const typeList = [
  { key: "new_request", label: <span>Yêu cầu mới</span> },
  { key: "bug", label: <span>Bug</span> },
];

export default function TaskForm() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("idProject");
  const taskState = useSelector((state) => state.properties.taskState);
  const user = useSelector((state) => state.auth.login.currentUser.data.user);
  const viewMode = useSelector((state) => state.viewMode.mode);
  const [taskName, setTaskName] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState([]);
  const [img, setImg] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [priority, setPriority] = useState("0");
  const [status, setStatus] = useState(1);
  const [type, setType] = useState("new_request");
  const [imgAdd, setImgAdd] = useState(null);
  const inpStates = useInputStates([taskName, link, description]);
  const [alert, setAlert] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [visibleAssignee, setVisibleAssignee] = useState(false);
  const [configStartDate, setConfigStartDate] = useState(
    dayjs(dayjs().format(dateFormat), dateFormat)
  );
  const [configEndDate, setConfigEndDate] = useState(null);
  const [minDate, setMinDate] = useState(
    dayjs(dayjs().format(dateFormat), dateFormat)
  );
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (taskState.slice(0, 7).includes("UPDATE")) {
      const taskId = taskState.slice(7);
      async function getTask(taskId) {
        const response = await getTaskDetailById(taskId);
        if (response.success) {
          const start = dayjs(response.data.startDate);
          const end = dayjs(response.data.endDate);

          setTaskName(response.data.title);
          setLink(response.data.link);
          setDescription(response.data.description);
          if (response.data.image !== "null" && response.data.image !== "") {
            setImg(response.data.image);
          } else {
            response.data.image = null;
            setImg(response.data.image);
          }
          setStartDate(start);
          setEndDate(end);
          setMinDate(start);
          setConfigStartDate(start);
          setConfigEndDate(end);
          setPriority(response.data.priority);
          setStatus(response.data.status);
          setType(response.data.type);
          setAssignee(response.data.assigneeId.map((member) => member._id));
        } else {
          return openSystemNoti("error", response.message);
        }
      }
      getTask(taskId);
    } else {
      setConfigStartDate(dayjs(dayjs().format(dateFormat), dateFormat));
      setConfigEndDate(null);
      setMinDate(dayjs(dayjs().format(dateFormat), dateFormat));
    }
  }, [taskState]);

  const getMemberList = useCallback(async () => {
    const response = await getMembers(projectId);
    setMemberList(response);
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;
    getMemberList();
  }, [projectId, getMemberList]);

  function chooseAssignee(memberId, checked) {
    if (checked) {
      setAssignee((prev) => [...prev, memberId]);
    } else {
      setAssignee((prev) => prev.filter((id) => id !== memberId));
    }
  }
  const [searchKeyword, setSearchKeyword] = useState("");
  const filteredMemberList = memberList.filter(
    (member) =>
      member.userName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      member.email.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const asigneeList = [
    {
      key: "customDropdown",
      label: (
        <div
          className="relative"
          style={{
            width: "280px",
            maxHeight: "400px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header cố định */}
          <div
            className="sticky top-0 z-10 bg-white"
            style={{ paddingBottom: 8 }}
          >
            {/* SVG đóng */}
            <div className="flex justify-end mb-2 pr-2 pt-2">
              <div
                className="cursor-pointer"
                onClick={() => setVisibleAssignee(false)}
              >
                <svg
                  className="w-[20px] h-[20px]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                >
                  <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                </svg>
              </div>
            </div>

            {/* Tìm kiếm */}
            <div className="px-2">
              <Input
                placeholder="Tìm thành viên..."
                size="small"
                allowClear
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
          </div>

          {/* Chọn tất cả */}
          <div
            className="flex items-center py-1 cursor-pointer gap-2"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const isAllSelected =
                assignee.length === filteredMemberList.length;
              const newAssignee = isAllSelected
                ? []
                : filteredMemberList.map((m) => m._id);
              setAssignee(newAssignee);
            }}
          >
            <Checkbox
              checked={assignee.length === filteredMemberList.length}
              indeterminate={
                assignee.length > 0 &&
                assignee.length < filteredMemberList.length
              }
              onChange={(e) => {
                const isAllSelected =
                  assignee.length === filteredMemberList.length;
                const newAssignee = isAllSelected
                  ? []
                  : filteredMemberList.map((m) => m._id);
                setAssignee(newAssignee);
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <span className="font-semibold ">Chọn tất cả</span>
          </div>

          {/* Danh sách thành viên */}

          {filteredMemberList.map((member) => (
            <label
              key={member._id}
              htmlFor={`asignee_${member._id}`}
              className="flex items-center cursor-pointer w-full md:w-auto mb-2 mt-2 hover:bg-gray-200"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                chooseAssignee(member._id, !assignee.includes(member._id));
              }}
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`asignee_${member._id}`}
                  checked={assignee.includes(member._id)}
                  onChange={(e) => chooseAssignee(member._id, e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                  className=""
                />

                <img
                  src={
                    member.avatar ||
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
                  }
                  alt={member.email}
                  className="w-[40px] h-[40px] rounded-full mr-2"
                />
                <div className="flex flex-col justify-center">
                  <span className="font-semibold">{member.userName}</span>
                  <span className="text-[12px] text-dark-gray">
                    {member.email}
                  </span>
                </div>
              </div>
            </label>
          ))}
        </div>
      ),
    },
  ];

  function getDateFromInp(dates) {
    if (!dates || dates.length < 2) return;

    const [start, end] = dates;

    setStartDate(start);
    setEndDate(end);
    setConfigStartDate(start);
    setConfigEndDate(end);
  }

  const pickerRef = useRef();

  function uploadImg(event) {
    const file = event.target.files[0];
    if (file) {
      setImgAdd(file);
      const url = URL.createObjectURL(file);
      setImg(url || null);
    }
  }
  async function saveTask() {
    setLoading(true);
    let shouldCloseForm = false; // ✅ Mặc định là sẽ đóng form

    try {
      // Các validation như cũ
      if (!taskName)
        setAlert((prev) =>
          prev.includes("TASK_NAME") ? prev : [...prev, "TASK_NAME"]
        );
      else setAlert((prev) => prev.filter((item) => item !== "TASK_NAME"));

      // if (!link)
      //   setAlert((prev) => (prev.includes("LINK") ? prev : [...prev, "LINK"]));
      // else setAlert((prev) => prev.filter((item) => item !== "LINK"));

      // if (!link.includes("http"))
      //   setAlert((prev) =>
      //     prev.includes("INVALID_LINK") ? prev : [...prev, "INVALID_LINK"]
      //   );
      // else setAlert((prev) => prev.filter((item) => item !== "INVALID_LINK"));

      if (!description)
        setAlert((prev) =>
          prev.includes("DESCRIPTION") ? prev : [...prev, "DESCRIPTION"]
        );
      else setAlert((prev) => prev.filter((item) => item !== "DESCRIPTION"));

      if (assignee.length === 0)
        setAlert((prev) =>
          prev.includes("ASSIGNEE") ? prev : [...prev, "ASSIGNEE"]
        );
      else setAlert((prev) => prev.filter((item) => item !== "ASSIGNEE"));

      if (!startDate || !endDate)
        setAlert((prev) => (prev.includes("DATE") ? prev : [...prev, "DATE"]));
      else setAlert((prev) => prev.filter((item) => item !== "DATE"));

      // if (!img)
      //   setAlert((prev) => (prev.includes("IMG") ? prev : [...prev, "IMG"]));
      // else setAlert((prev) => prev.filter((item) => item !== "IMG"));

      if (
        !taskName ||
        // !link ||
        // !link.includes("http") ||
        !description ||
        assignee.length === 0 ||
        !startDate ||
        !endDate
        // !img
      )
        return;

      let newTaskId = "";

      if (taskState.slice(0, 4).includes("ADD")) {
        const response = await addTask({
          image: imgAdd,
          assigneeId: assignee,
          title: taskName,
          link: link,
          description: description,
          startDate: startDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD"),
          status: 1,
          projectId: projectId,
          assignerId: user._id,
          priority: priority,
          type: type,
        });

        if (response.success) {
          newTaskId = response.data._id;
          openSystemNoti("success", "Đã thêm công việc");
          dispatch(setTaskForm(`DETAILS_${newTaskId}`));
          dispatch(
            getListTaskByProjectId({
              projectId: projectId,
              page: 1,
              limit: viewMode === "list" ? 20 : 100,
            })
          );
          shouldCloseForm = false; // ✅ Không đóng form, vì đã mở chi tiết
        } else {
          return openSystemNoti("error", response.message);
        }
      } else {
        const response = await updateTask(taskState.slice(7), {
          image: imgAdd ? imgAdd : img,
          // image: "",
          assigneeId: assignee,
          title: taskName,
          link: link,
          description: description,
          startDate: startDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD"),
          status: status,
          projectId: projectId,
          assignerId: user._id,
          priority: priority,
          type: type,
        });

        if (response.success) {
          newTaskId = response.data._id;
          openSystemNoti("success", "Đã cập nhật công việc");
          dispatch(setTaskForm(`DETAILS_${newTaskId}`));
          dispatch(
            getListTaskByProjectId({
              projectId: projectId,
              page: 1,
              limit: viewMode === "list" ? 20 : 100,
            })
          );
          shouldCloseForm = false;
        } else {
          return openSystemNoti("error", response.message);
        }
      }
    } catch (error) {
      console.error("Lỗi khi lưu task:", error);
      openSystemNoti("error", "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setTimeout(() => {
        // ✅ Lấy lại danh sách công việc
        if (shouldCloseForm) dispatch(setTaskForm("CLOSE")); // ✅ Chỉ đóng nếu cần
        setImgAdd(null);
        setLoading(false);
      }, 3000);
    }
  }

  useEffect(() => {
    if (alert.length === 0) return;
    if (alert.length > 3)
      return openSystemNoti(
        "error",
        "Bạn đang để trống quá nhiều thông tin bắt buộc"
      );
    if (alert.includes("TASK_NAME"))
      return openSystemNoti("error", "Tên không được để trống");
    if (alert.includes("DESCRIPTION"))
      return openSystemNoti("error", "Mô tả không được để trống");
    // if (alert.includes("LINK"))
    //   return openSystemNoti("error", "Đường dẫn không được để trống");
    // if (alert.includes("INVALID_LINK"))
    //   return openSystemNoti("error", "Đường dẫn không hợp lệ");
    if (alert.includes("ASSIGNEE"))
      return openSystemNoti("error", "Chưa có thành viên nào nhận việc này");
    if (alert.includes("DATE"))
      return openSystemNoti("error", "Thời hạn thực hiện không được để trống");
    // if (alert.includes("IMG"))
    //   return openSystemNoti("error", "Hãy thêm ảnh mô tả");
  }, [alert]);

  function deleteTask() {}

  function closeForm() {
    const isFormDirty = taskName || link || description || startDate || endDate;

    if (isFormDirty) {
      const confirmClose = window.confirm(
        "Bạn có chắc chắn muốn đóng? Dữ liệu chưa được lưu sẽ bị mất."
      );
      if (!confirmClose) return;
    }

    dispatch(setTaskForm("CLOSE"));
  }

  // ✅ Thêm vào useEffect để hỗ trợ dán ảnh bằng Ctrl + V
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.indexOf("image") === 0) {
          const file = item.getAsFile();
          if (file) {
            const url = URL.createObjectURL(file);
            setImg(url); // Preview ảnh
            setImgAdd(file); // File để gửi trong submit
            message.success("Ảnh đã được dán từ clipboard");
          }
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, []);

  const handleDeleteImage = () => {
    setImg("");
    setImgAdd(null);
    message.success("Ảnh đã được xóa");
  };
  return (
    <div className="z-100 fixed top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-center">
      <div
        className="fixed w-[100vw] h-[100vh] bg-black opacity-30"
        onClick={closeForm}
      ></div>
      <div className="relative z-110 w-[70vw] h-[95vh] p-3  pt-0 px-3 pb-3 flex flex-col items-center bg-white border border-gray-border rounded-md shadow-md overflow-y-auto">
        <div className="sticky top-0 w-full p-3 justify-between items-center bg-white z-10">
          <div
            className="absolute right-4 p-1 rounded-md cursor-pointer duration-200 hover:bg-light-gray active:scale-90"
            onClick={closeForm}
          >
            <svg
              className="w-[25px] h-[25px] aspect-square"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </div>
          <div className="flex-grow text-center">
            <span className=" text-center font-semibold text-2xl !mb-2  ">
              {taskState.slice(0, 4).includes("ADD")
                ? "Thêm công việc mới"
                : "Cập nhật công việc"}
            </span>
          </div>
        </div>

        <div className="w-full h-full flex flex-col items-center px-3 pb-3">
          <div className="w-full flex">
            <div className="basis-[75%] !mr-2">
              <div className="group relative flex items-center">
                <label
                  htmlFor="form-taskName"
                  className={`absolute left-3 z-10 px-2 text-sm text-gray-text rounded-b-lg
                                    cursor-text duration-200 group-focus-within:text-black group-focus-within:top-[-13px] group-focus-within:bg-white
                                    ${
                                      inpStates[0]
                                        ? `top-[-13px] bg-white`
                                        : `top-[9px]`
                                    }`}
                >
                  <span className="text-red !mr-[2px]">*</span>
                  <span
                    className={alert.includes("TASK_NAME") ? "!text-red" : ""}
                  >
                    Tên công việc
                  </span>
                </label>
                <Input
                  id="form-taskName"
                  className="!rounded-md"
                  size="large"
                  variant="filled"
                  allowClear
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </div>

              <div className="group relative flex items-center !mt-[13px]">
                <label
                  htmlFor="form-link"
                  className={`absolute left-3 z-10 px-2 text-sm text-gray-text rounded-b-lg
                                    cursor-text duration-200 group-focus-within:text-black group-focus-within:top-[-13px] group-focus-within:bg-white
                                    ${
                                      inpStates[1]
                                        ? `top-[-13px] bg-white`
                                        : `top-[9px]`
                                    }`}
                >
                  <span>Liên kết</span>
                </label>
                <Input
                  id="form-link"
                  className="!rounded-md"
                  size="large"
                  variant="filled"
                  allowClear
                  value={link}
                  onChange={(e) => setLink(e.target.value.trim())}
                />
              </div>

              <div className="group relative flex items-center !mt-[13px]">
                <label
                  className={`absolute left-3 z-10 px-2 text-sm text-gray-text rounded-b-lg
                                    cursor-text duration-200 group-focus-within:text-black group-focus-within:top-[-13px] group-focus-within:bg-white
                                    ${
                                      inpStates[2]
                                        ? `top-[-13px] bg-white`
                                        : `top-[9px]`
                                    }`}
                  htmlFor="signIn-email"
                >
                  <span className="text-red !mr-[2px]">*</span>
                  <span
                    className={alert.includes("DESCRIPTION") ? "!text-red" : ""}
                  >
                    Mô tả
                  </span>
                </label>
                <TextArea
                  id="signIn-email"
                  className="!rounded-md"
                  size="large"
                  variant="filled"
                  allowClear
                  autoSize={{ minRows: 5 }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="basis-[25%]">
              <div className="flex flex-col">
                <label className="!mr-1">
                  <span className="text-red !mr-[2px]">*</span>
                  <span
                    className={
                      alert.includes("ASSIGNEE") ? "!text-red" : "font-semibold"
                    }
                  >
                    Người nhận việc
                  </span>
                </label>

                <Dropdown
                  menu={{ items: asigneeList }}
                  trigger={["click"]}
                  placement="bottom"
                  open={visibleAssignee}
                  onOpenChange={(flag) => setVisibleAssignee(flag)}
                >
                  <Button onClick={() => setVisibleAssignee(!visibleAssignee)}>
                    {assignee.length > 0
                      ? `${assignee.length} thành viên`
                      : "Chưa có ai"}
                  </Button>
                </Dropdown>
              </div>

              <div className="flex flex-col mt-2">
                <span className="font-semibold">Độ ưu tiên</span>
                <Dropdown
                  trigger={"click"}
                  placement="bottom"
                  menu={{
                    items: priorityList,
                    onClick: ({ key }) => setPriority(key),
                  }}
                >
                  <Button>
                    {priority === "0"
                      ? "Thấp"
                      : priority === "1"
                      ? "Trung bình"
                      : priority === "2"
                      ? "Cao"
                      : "Chưa có"}
                  </Button>
                </Dropdown>
              </div>

              <div className="flex flex-col mt-2">
                <span className="font-semibold">Phân loại</span>
                <Dropdown
                  trigger={"click"}
                  placement="bottom"
                  menu={{
                    items: typeList,
                    onClick: ({ key }) => setType(key),
                  }}
                >
                  <Button>
                    {type === "new_request"
                      ? "Yêu cầu mới"
                      : type === "bug"
                      ? "Bug"
                      : "Chưa có"}
                  </Button>
                </Dropdown>
              </div>

              <div className="flex flex-col mt-2">
                <label className="!mr-1">
                  <span className="text-red !mr-[2px]">*</span>
                  <span
                    className={
                      alert.includes("DATE") ? "!text-red" : "font-semibold"
                    }
                  >
                    Thời hạn
                  </span>
                </label>
                <DatePicker.RangePicker
                  ref={pickerRef}
                  placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                  format={dateFormat}
                  value={[configStartDate ?? null, configEndDate ?? null]}
                  onChange={getDateFromInp}
                  onCalendarChange={(dates) => {
                    if (dates?.[0] && dates?.[1]) {
                      // Đóng picker sau khi chọn đủ 2 ngày
                      setTimeout(() => {
                        pickerRef.current?.blur(); // hoặc pickerRef.current?.picker?.hide()
                      }, 100); // delay 1 tí để đảm bảo chọn xong đã render xong
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <label
            htmlFor="form-upload"
            className={`grow w-full !mt-2 py-1 px-5 border-2 border-dashed rounded-md !flex !flex-col !justify-center !items-center fill-black text-black
                        group cursor-pointer duration-200 hover:bg-light-gray active:scale-90 ${
                          img ? "!hidden" : ""
                        }`}
          >
            <div className="font-semibold flex items-center mb-2">
              <svg
                className="w-[25px] h-[25px] !mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 109.3 192 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-210.7 73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-64z" />
              </svg>
              <span className={alert.includes("IMG") ? "!text-red" : ""}>
                Chọn ảnh mô tả
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              id="form-upload"
              onChange={(e) => uploadImg(e)}
            />
          </label>
          <label
            htmlFor="form-upload"
            className={
              img
                ? "grow w-fit mt-2 !flex !flex-col !justify-center !items-center"
                : "hidden"
            }
          >
            {img && (
              <div className="relative">
                <img
                  className="!object-contain max-w-[40vw] border rounded-md cursor-pointer fit-image"
                  src={img}
                  alt="Image Task"
                />

                <button
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full "
                  onClick={() => handleDeleteImage()}
                >
                  X
                </button>
              </div>
            )}
            {img && <span className="mt-2 text-dark-gray">Ảnh mô tả</span>}
          </label>
          <div className="sticky bottom-0 w-full mt-2 pt-2 z-10">
            <div className=" flex justify-end gap-1">
              <Button
                className="w-[130px] !font-semibold flex items-center justify-center"
                color="blue"
                variant="solid"
                loading={loading}
                onClick={() => saveTask()}
              >
                {loading
                  ? taskState.slice(0, 4).includes("ADD")
                    ? "Đang thêm..."
                    : "Đang cập nhật..."
                  : taskState.slice(0, 4).includes("ADD")
                  ? "Thêm"
                  : "Cập nhật"}
              </Button>

              {taskState.slice(0, 4).includes("UPDATE") && (
                <Button
                  className="w-[100px] !font-semibold !ml-1"
                  color="danger"
                  variant="solid"
                  onClick={() => deleteTask()}
                >
                  Xóa
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
