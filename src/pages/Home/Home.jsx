import "./Home.scss";
export default function Home() {
  return( 
    <div className="kanban-container">
   {/* Column: Công việc mới */}
   <div className="kanban-column">
     <h3>Công việc mới: 1</h3>
     <button className="add-task">➕ Thêm vấn đề</button>
     <div className="kanban-card">
       <p>fix header ✏️</p>
       <div className="card-footer">
         <span className="project-label">📅 Kan-1</span>
         <strong>TuanPM</strong>
       </div>
     </div>
     <div className="kanban-card">
       <p>fix header ✏️</p>
       <div className="card-footer">
         <span className="project-label">📅 Kan-2</span>
         <strong>TuanPM</strong>
       </div>
     </div>
     <div className="kanban-card">
       <p>fix header ✏️</p>
       <div className="card-footer">
         <span className="project-label">📅 Kan-3</span>
         <strong>TuanPM</strong>
       </div>
     </div>
   </div>

   {/* Column: Đang thực hiện */}
   <div className="kanban-column">
     <h3>Đang thực hiện: 1</h3>
     <button className="add-task">➕ Thêm vấn đề</button>
     <div className="kanban-card">
       <p>fix sidebar ✏️</p>
       <div className="card-footer">
         <span className="project-label">📅 Kan-1</span>
         <strong>HuyNQ</strong>
       </div>
     </div>
   </div>

   {/* Column: Hoàn thành */}
   <div className="kanban-column">
     <h3>Hoàn thành: 1</h3>
     <button className="add-task">➕ Thêm vấn đề</button>
     <div className="kanban-card">
       <p>test ✏️</p>
       <div className="card-footer">
         <span className="project-label">📅 Kan-1</span>
         <strong>HuyNQ</strong>
       </div>
     </div>
   </div>

   {/* Column: Kết thúc */}
   <div className="kanban-column">
     <h3>Kết thúc: 1</h3>
     <button className="add-task">➕ Thêm vấn đề</button>
     <div className="kanban-card">
       <p>note ✏️</p>
       <div className="card-footer">
         <span className="project-label">📅 Kan-1</span>
         <strong>HuyNQ</strong>
       </div>
     </div>
   </div>
 </div>
)
}
