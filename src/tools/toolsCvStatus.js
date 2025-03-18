export const toolCvStatus = (staus) => {
  switch (staus) {
    case "to do":
      return "Đang thực hiện";
    case "inprogress":
      return "Chưa hoàn thành";
    case "done":
      return "Đã Hoàn thành";
    default:
      return "Chưa hoàn thành"; // Default to "Chưa hoàn thành"
  }
};
export const toolTaskStatus = (task) => {
  switch (task) {
    case "Công việc mới":
      return "pending";
    case "Đang thực hiện":
      return "inProgress";
    case "Hoàn thành":
      return "completed";
    case "Kết thúc":
      return "done";
    default:
      return "pending";
  }
};
