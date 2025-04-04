import React, { useEffect, useState } from "react";
import { getTaskMembers } from "../../../services/projectService";
import styles from "../styles/TotalProjectMembers.module.scss";
const TotalProjectMember = ({ idProject }) => {
  const [taskCount, setTaskCount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getTaskMembers(idProject);
        setTaskCount(data.data);
      } catch (err) {
        setError("Lỗi khi tải danh sách thành viên");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [idProject]);
  if (loading) {
    return <div>Đang tải...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.members_container}>
      <div className={styles.members_bubble}>
        {/* Hiển thị số lượng thành viên */}
        <span>{taskCount}</span>
      </div>
    </div>
  );
};

export default TotalProjectMember;
