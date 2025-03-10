import "./ListHome.scss";
import "../Home/Home.scss";
import { useNavigate } from "react-router-dom";


const tasks = [
   {
      id: 1,
      name: "fix header",
      assignees: ["image_4.png"],
      comments: "",
      startDate: "01/01/2029",
      endDate: "01/01/2029",
      status: "Hoàn thành",
      link: "https://",
    },
    {
      id: 2,
      name: "fix header",
      assignees: ["image_4.png"],
      comments: "",
      startDate: "01/01/2029",
      endDate: "01/01/2029",
      status: "Hoàn thành",
      link: "https://",
    },
    {
      id: 3,
      name: "fix header",
      assignees: ["image_4.png"],
      comments: "",
      startDate: "01/01/2029",
      endDate: "01/01/2029",
      status: "Hoàn thành",
      link: "https://",
    },
];

const TaskTable = () => {
   const navigate = useNavigate();

  return (
    <div className="task-table-container">

       {/* Header Section */}
       <div className="header-section flex items-center justify-between p-4 border-b">
        {/* Logo */}
        <div className="header-container flex items-center gap-4">
          <p className="text-gray-500 text-sm">Dự án / Phần mềm đánh giá</p>
          <div className="flex items-center gap-2">
            <img onClick={() => navigate("/")} src='src/assets/image/Column.png' alt="LIFETEK" className="logo-img" />
            <img src='src/assets/image/List.png' alt="LIFETEK" className="logo-img" />
          </div>
        </div>

        {/* Tìm kiếm & Avatars */}
        <div className="flex items-center gap-4">
          {/* Ô tìm kiếm */}
          <div className="search-container relative flex items-center">
            <svg
              className="search-icon absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
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
              className="pl-10 pr-4 py-2 border rounded-md w-64"
            />

          {/* Danh sách avatar */}
         {/* Danh sách avatar với hình ảnh */}
          <div className="flex -space-x-2 overflow-hidden">
            {[
              "src/assets/image/image_4.png",
              "src/assets/image/image_5.png",
              "src/assets/image/image_6.png",
              "src/assets/image/image_7.png",
              "src/assets/image/image_8.png",
              "src/assets/image/dot.png"
            ].map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt={`Avatar ${index + 1}`}
                className="w-8 h-8 rounded-full border border-white shadow"
              />
            ))}
          </div>
          </div>
        </div>
        
        <div className="task-header1">
          <div className="task-add1">
            <img src="src/assets/image/Problem.png" alt="Add Task" />
            <p>Thêm vấn đề</p>
          </div>
          <div className="task-icons1">
            <img src="src/assets/image/Trash.png" alt="List" />
            <img src="src/assets/image/Filter.png" alt="Columns" />
          </div>
      </div>
      </div>

      <table className="task-table">
        <thead>
          <tr>
            <th></th> {/* Thêm cột trống để giữ vị trí checkbox */}
            <th>STT</th>
            <th>Tên công việc</th>
            <th>Người nhận việc</th>
            <th>Bình luận</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Trạng thái</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task.id}>
              <td><input type="checkbox" /></td>
              <td>{index + 1}</td>
              <td className="task-name">
                <img src="src/assets/image/Pen.png" alt="edit" className="edit-icon" />
                {task.name}
              </td>
              <td className="assignees">
               {task.assignees?.map((avatar, i) => (
                  <img key={i} src={`src/assets/image/${avatar}`} alt="user" className="avatar" />
               ))}
               <button className="add-user">+</button>
               </td>
              <td className="comment-cell">
                <img src="src/assets/image/Chat_.png" alt="comments" className="comment-icon" />
              </td>
              <td className="date-cell">
              {task.startDate}
                <img src="src/assets/image/Vector.png" alt="start-date" className="calendar-icon" />
              </td>
              <td className="date-cell">
              {task.endDate}
                <img src="src/assets/image/Vector.png" alt="end-date" className="calendar-icon" />
              </td>
              <td className="status-cell">{task.status}</td>
              <td><a href={task.link} target="_blank" rel="noopener noreferrer">🔗</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
