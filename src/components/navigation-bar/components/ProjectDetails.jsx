import React, { useEffect, useState } from "react";
import { Modal, Descriptions, Button, message, Input } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { deleteProject } from "../../../redux/projectSlice";

const ProjectDetailModal = ({ project, open, onClose, onEdit }) => {
  const dispatch = useDispatch();
  const [deadline, setDeadline] = useState(0);
  const { TextArea } = Input;
  const [showAllMembers, setShowAllMembers] = useState(false);

  const membersToShow = showAllMembers
    ? project.members || []
    : (project.members || []).slice(0, 2);
  useEffect(() => {
    if (!project) return;

    const endDate = new Date(project?.endDate);
    const curDate = new Date();
    setDeadline(Math.floor((endDate - curDate) / (1000 * 60 * 60 * 24)));
  }, [project]);

  if (!project) return null;

  const handleDelete = async () => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa dự án này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await dispatch(deleteProject(project._id));
          message.success("Xóa dự án thành công!");
          onClose();
        } catch (error) {
          message.error("Xóa dự án thất bại!");
          console.error(error);
        }
      },
    });
  };

  return (
    <Modal
      title={
        <div
          style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center" }}
        >
          Chi tiết dự án
        </div>
      }
      open={open}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="edit" type="primary" onClick={onEdit}>
          Cập nhật
        </Button>,
        <Button key="delete" danger onClick={handleDelete}>
          Xóa
        </Button>,
      ]}
    >
      <div className="flex">
        <div className="basis-[60%]">
          <div className="text-[12px] mt-3 text-white font-semibold">
            <span
              className={`py-1 px-3 !mr-1 rounded-full
                                ${
                                  project?.status === 0
                                    ? "bg-yellow"
                                    : project?.status === 1
                                    ? "bg-red"
                                    : project?.status === 2
                                    ? "bg-green"
                                    : "hidden"
                                }
                            `}
            >
              Trạng thái:{" "}
              {project?.status === 0
                ? "Đang thực hiện"
                : project?.status === 1
                ? "Chưa hoàn thành"
                : project?.status === 2
                ? "Đã hoàn thành"
                : ""}
            </span>
            <span
              className={`py-1 px-3 !mr-1 rounded-full ml-2
                                ${
                                  project?.priority === 0
                                    ? "bg-red"
                                    : project?.priority === 1
                                    ? "bg-yellow"
                                    : project?.priority === 2
                                    ? "bg-green"
                                    : "hidden"
                                }
                            `}
            >
              Độ ưu tiên:{" "}
              {project?.priority === 0
                ? "Thấp"
                : project?.priority === 1
                ? "Trung bình"
                : project?.priority === 2
                ? "Cao"
                : ""}
            </span>
          </div>
          <div className="font-semibold text-3xl normal-case mt-3">
            {project.name}
          </div>
          <div className="flex items-center text-1.5xl font-semibold mt-1">
            Mã dự án: {project.code}
          </div>
          <div className="flex items-center text-[12px] text-dark-gray mt-1">
            <span>{dayjs(project.startDate).format("DD/MM/YYYY")}</span>
            <span className="mx-2">đến</span>
            <span> {dayjs(project.endDate).format("DD/MM/YYYY")}</span>
            <span
              className={`text-white font-semibold !ml-2 py-[2px] px-3 rounded-full
                                          ${
                                            deadline > 0
                                              ? "bg-green"
                                              : deadline < 0
                                              ? "bg-red"
                                              : ""
                                          }`}
            >
              {deadline > 0
                ? `Còn ${Math.abs(deadline)} ngày`
                : deadline < 0
                ? `Quá hạn ${Math.abs(deadline)} ngày`
                : ""}
            </span>
          </div>
          <div className="flex items-center text-1xl font-semibold mt-2">
            Thành viên tham gia:&nbsp;
            <span className="flex items-center flex-wrap gap-1">
              {membersToShow.map((m, index) => (
                <span key={m._id || index}>
                  {(m.userName || m.fullName) +
                    (index < membersToShow.length - 1 ? ", " : "")}
                </span>
              ))}

              {project.members?.length > 2 && !showAllMembers && (
                <EllipsisOutlined
                  onClick={() => setShowAllMembers(true)}
                  className="cursor-pointer ml-3 text-gray-600 hover:text-black text-2xl"
                />
              )}
              {showAllMembers && (
                <EllipsisOutlined
                  onClick={() => setShowAllMembers(false)}
                  className="cursor-pointer ml-3 text-gray-600 hover:text-black text-2xl"
                />
              )}
            </span>
          </div>
        </div>
        <div className="basis-[40%] max-h-[50%] !ml-2 flex flex-col items-center mt-3 mb-3 text-gray-600">
          <TextArea
            value={project.description}
            readOnly
            rows={8}
            className="w-full"
          />
          Mô tả dự án
        </div>
      </div>
    </Modal>
  );
};

export default ProjectDetailModal;
