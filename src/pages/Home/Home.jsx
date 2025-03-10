import { useState } from "react";
import "./Home.scss";
import { useNavigate } from "react-router-dom";

const columns = [
  { id: 1, title: "Công việc mới", tasks: [
      { id: 1, title: "fix header", project: "Kan-1", assignee: "TuanPM" },
      { id: 2, title: "fix header", project: "Kan-2", assignee: "TuanPM" },
      { id: 3, title: "fix header", project: "Kan-3", assignee: "TuanPM" }
    ]
  },
  { id: 2, title: "Đang thực hiện", tasks: [
      { id: 4, title: "fix sidebar", project: "Kan-1", assignee: "HuyNQ" }
    ]
  },
  { id: 3, title: "Hoàn thành", tasks: [
      { id: 5, title: "test", project: "Kan-1", assignee: "HuyNQ" },
      { id: 6, title: "test", project: "Kan-1", assignee: "HuyNQ" },
      { id: 7, title: "test", project: "Kan-1", assignee: "HuyNQ" },
      { id: 8, title: "test", project: "Kan-1", assignee: "HuyNQ" }
    ]
  },
  { id: 4, title: "Kết thúc", tasks: [
      { id: 9, title: "note", project: "Kan-1", assignee: "HuyNQ" }
    ]
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [checkedTasks, setCheckedTasks] = useState({});

  // Hàm xử lý khi checkbox thay đổi
  const handleCheckboxChange = (taskId) => {
    setCheckedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId], // Toggle trạng thái checked
    }));
  };

  return (
    <div className="home-container">
      {/* Header Section */}
      <div className="header-section flex items-center justify-between p-4 border-b">
        {/* Logo */}
        <div className="header-container flex items-center gap-4">
          <p className="text-gray-500 text-sm">Dự án / Phần mềm đánh giá</p>
          <div className="flex items-center gap-2">
            <img src='src/assets/image/Column.png' alt="LIFETEK" className="logo-img" />
            <img onClick={() => navigate("/ListHome")} src='src/assets/image/List.png' alt="LIFETEK" className="logo-img" />
          </div>
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

          <div className="task-header">
          <div className="task-icons">
            <img src="src/assets/image/Trash.png" alt="List" />
            <img src="src/assets/image/Filter.png" alt="Columns" />
          </div>
      </div>

        </div>

      {/* Kanban Board */}
      <div className="kanban-container">
        {columns.map(column => (
          <div key={column.id} className="kanban-column">
            <h3>{column.title}: {column.tasks.length}</h3>
            <button className="add-task">➕ Thêm vấn đề</button>
            {column.tasks.map(task => (
              <div key={task.id} className="kanban-card">
                <div className="task-content">
                  <p>{task.title} ✏️</p>
                  <input
                    type="checkbox"
                    checked={checkedTasks[task.id] || false}
                    onChange={() => handleCheckboxChange(task.id)}
                  />
                </div>
                <div className="card-footer">
                  <span className="project-label">📅 {task.project}</span>
                  <strong>{task.assignee}</strong>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
