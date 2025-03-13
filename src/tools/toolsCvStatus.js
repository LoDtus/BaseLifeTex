export const toolCvStatus = (staus) => {
  switch (staus) {
    case "to do":
      return "Đang thực hiện";
    case "inprogress":
      return "Chưa hoàn thành";
    case "done":
      return "Hoàn thành";
    default:
      return "Chưa hoàn thành"; // Default to "Chưa hoàn thành"
  }
};
