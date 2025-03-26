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
      return 1;
    case "Đang thực hiện":
      return 2;
    case "Hoàn thành":
      return 4;
    case "Kết thúc":
      return 7;
    default:
      return 1;
  }
};
