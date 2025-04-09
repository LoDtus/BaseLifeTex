import { Input, Dropdown, Button, DatePicker, Checkbox, Menu } from "antd";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { useInputStates } from "@/hook/propertiesHook";
import { useSearchParams } from "react-router-dom";
import { setTaskForm } from "@/redux/propertiesSlice";
import { getMembers } from "@/services/projectService";

const { TextArea } = Input;
import customParseFormat from "dayjs/plugin/customParseFormat";
import { toast } from "react-toastify";
import { postIssueData } from "../../../../services/issueService";
import { getListTaskByProjectId } from "../../../../redux/taskSlice";
import Loading from "../../../common/Loading";
import { setLoading } from "../../../../redux/loadingSlice";
dayjs.extend(customParseFormat);
const dateFormat = "DD-MM-YYYY";

const priorityList = [
  { key: 0, label: <span>Thấp</span> },
  { key: 1, label: <span>Trung bình</span> },
  { key: 2, label: <span>Cao</span> },
];

const typeList = [
  { key: "new_request", label: <span>Yêu cầu mới</span> },
  { key: "bug", label: <span>Bug</span> },
];

export default function TaskForm() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);

  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("idProject");

  const taskForm = useSelector((state) => state.properties.taskForm);

  const [taskName, setTaskName] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [asignee, setAsignee] = useState([]);
  const [img, setImg] = useState(null);
  const [imgAdd, setImgAdd] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [priority, setPriority] = useState(0);
  const [type, setType] = useState("new_request");
  const [isLoading, setIsLoading] = useState(false);

  const inpStates = useInputStates([taskName, link, description]);
  const [alert, setAlert] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [visibleAsignee, setVisibleAsignee] = useState(false);

  const getMemberList = useCallback(async () => {
    const response = await getMembers(projectId);
    setMemberList(response);
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;
    getMemberList();
  }, [projectId, getMemberList]);

  function chooseAsignee(memberId, checked) {
    if (checked) {
      setAsignee((prev) => [...prev, memberId]);
    } else {
      setAsignee((prev) => prev.filter((id) => id !== memberId));
    }
  }

  const asigneeList = [
    {
      key: "close",
      label: (
        <div
          className="flex justify-end"
          type="primary"
          onClick={() => setVisibleAsignee(false)}
        >
          <svg
            className="w-[25px] h-[25px] aspect-square"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </div>
      ),
    },
    ...memberList.map((member) => ({
      key: member._id,
      label: (
        <label
          htmlFor={`asignee_${member._id}`}
          className="!flex items-center cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            chooseAsignee(member._id, !asignee.includes(member._id));
          }}
        >
          <Checkbox
            id={`asignee_${member._id}`}
            checked={asignee.includes(member._id)}
            onChange={(e) => chooseAsignee(member._id, e.target.checked)}
            onClick={(e) => e.stopPropagation()}
          />
          <img
            src={member.avatar}
            alt={member.email}
            className="w-[40px] h-[40px] aspect-square rounded-full !mx-2"
            key={`img-${member._id}`}
          />
          <div className="flex flex-col" key={`info-${member._id}`}>
            <span className="font-semibold">{member.userName}</span>
            <span className="text-[12px] text-dark-gray">{member.email}</span>
          </div>
        </label>
      ),
    })),
  ];

  function getDateFromInp(dates, dateStrings) {
    if (!dates || !dateStrings) return;
    if (dates) {
      setStartDate(dates[0].format("YYYY-MM-DD"));
      setEndDate(dates[1].format("YYYY-MM-DD"));
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  }

  function uploadImg(event) {
    const file = event.target.files[0];
    if (file) {
      setImgAdd(file);
      const url = URL.createObjectURL(file);
      setImg(url || null);
    }
  }

  async function saveTask() {
    if (!taskName)
      setAlert((prev) =>
        prev.includes("TASK_NAME") ? prev : [...prev, "TASK_NAME"]
      );
    if (!link)
      setAlert((prev) => (prev.includes("LINK") ? prev : [...prev, "LINK"]));
    if (!description)
      setAlert((prev) =>
        prev.includes("DESCRIPTION") ? prev : [...prev, "DESCRIPTION"]
      );
    if (asignee.length === 0)
      setAlert((prev) =>
        prev.includes("ASIGNEE") ? prev : [...prev, "ASIGNEE"]
      );
    if (!startDate || !endDate)
      setAlert((prev) => (prev.includes("DATE") ? prev : [...prev, "DATE"]));
    if (!img)
      setAlert((prev) => (prev.includes("IMG") ? prev : [...prev, "IMG"]));
    // console.log(taskName, link, description, asignee, startDate, endDate, img);

    try {
      setIsLoading(true);
      const issueData = await postIssueData({
        idProject: projectId,
        title: taskName,
        link,
        description,
        personName: asignee,
        startDate,
        endDate,
        priority,
        type,
        image: imgAdd,
        assignerId: user.data.user._id,
      });
      //   console.log(issueData);
      if (issueData.success === true) {
        toast.success("Thêm công việc thành công!");
        dispatch(
          getListTaskByProjectId({
            projectId: projectId,
            page: 1,
            limit: 100,
          })
        );
        dispatch(setTaskForm("CLOSE"));
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setTaskName("");
      setLink("");
      setDescription("");
      setAsignee([]);
      setImg(null);
      setStartDate(null);
      setEndDate(null);
      setPriority(0);
      setType("new_request");
      setLoading(false);
    }
  }

  function deleteTask() {}

  function closeForm() {
    // if (taskName || link || description || img) {

    // }
    dispatch(setTaskForm("CLOSE"));
  }

  return (
    <div className="z-100 fixed top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-center">
      <div
        className="fixed w-[100vw] h-[100vh] bg-black opacity-30"
        onClick={() => closeForm()}
      ></div>

      <div className="relative z-110 w-[70vw] h-[95vh] p-3 flex flex-col items-center bg-white border border-gray-border rounded-md shadow-md overflow-y-auto">
        <div
          className="absolute right-4 p-1 rounded-md cursor-pointer duration-200 hover:bg-light-gray active:scale-90"
          onClick={() => dispatch(setTaskForm("CLOSE"))}
        >
          <svg
            className="w-[25px] h-[25px] aspect-square"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </div>
        <span className="font-semibold text-2xl !mb-2">Thêm công việc mới</span>

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
                <span className={alert === "TASK_NAME" ? "!text-red" : ""}>
                  Tên công việc
                </span>
              </label>
              <Input
                id="form-taskName"
                className="!rounded-md"
                size="large"
                variant="filled"
                allowClear
                onBlur={(e) => setTaskName(e.target.value.trim())}
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
                <span className="text-red !mr-[2px]">*</span>
                <span>Liên kết</span>
              </label>
              <Input
                id="form-link"
                className="!rounded-md"
                size="large"
                variant="filled"
                allowClear
                onBlur={(e) => setLink(e.target.value.trim())}
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
                <span>Mô tả</span>
              </label>
              <TextArea
                id="signIn-email"
                className="!rounded-md"
                size="large"
                variant="filled"
                allowClear
                autoSize={{ minRows: 5 }}
                onBlur={(e) => setDescription(e.target.value.trim())}
              />
            </div>
          </div>
          <div className="basis-[25%]">
            <div className="flex flex-col">
              <label className="!mr-1" htmlFor="">
                <span className="text-red !mr-[2px]">*</span>
                <span className="font-semibold">Người nhận việc</span>
              </label>
              <Dropdown
                menu={{ items: asigneeList }}
                trigger={"click"}
                placement="bottom"
                open={visibleAsignee}
                onOpenChange={(flag) => {
                  if (!flag) setVisibleAsignee(false);
                  else setVisibleAsignee(true);
                }}
              >
                <Button onClick={() => setVisibleAsignee(!visibleAsignee)}>
                  {asignee.length > 0
                    ? `${asignee.length} thành viên`
                    : "Chưa có ai"}
                </Button>
              </Dropdown>
            </div>

            <div className="flex flex-col mt-2">
              <label className="!mr-1" htmlFor="">
                <span className="font-semibold">Độ ưu tiên</span>
              </label>
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
              <label className="!mr-1" htmlFor="">
                <span className="font-semibold">Phân loại</span>
              </label>
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
              <label className="!mr-1" htmlFor="">
                <span className="text-red !mr-[2px]">*</span>
                <span className="font-semibold">Thời hạn</span>
              </label>
              <DatePicker.RangePicker
                placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                format={dateFormat}
                defaultValue={[
                  dayjs(dayjs().format(dateFormat), dateFormat),
                  null,
                ]}
                minDate={dayjs(dayjs().format(dateFormat), dateFormat)}
                onChange={getDateFromInp}
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
            <span>Chọn ảnh mô tả</span>
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
              ? "grow w-full mt-2 !flex !flex-col !justify-center !items-center"
              : "hidden"
          }
        >
          {img && (
            <img
              className="!object-contain max-w-[40vw] border rounded-md"
              src={img}
              alt="Image Task"
            />
          )}
          {img && <span className="mt-2 text-dark-gray">Ảnh mô tả</span>}
        </label>

        <div className="w-full mt-2 flex justify-end">
          <Button
            className="w-[100px] !font-semibold"
            color="blue"
            variant="solid"
            onClick={() => saveTask()}
          >
            Lưu
          </Button>
          <Button
            className="w-[100px] !font-semibold !ml-1"
            color="danger"
            variant="solid"
            onClick={() => deleteTask()}
          >
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
}
