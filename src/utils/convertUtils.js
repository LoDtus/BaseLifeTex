export function convertDateYMD(date) {
  const parsedDate = new Date(date);
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
}

export function convertDate(isoDateStr) {
  if (!isoDateStr) return "";
  return new Date(isoDateStr).toISOString().split("T")[0];
}

export function convertStatus(staus) {
  switch (staus) {
    case 0:
      return "Đang thực hiện";
    case 1:
      return "Chưa hoàn thành";
    case 2:
      return "Đã Hoàn thành";
    default:
      return "Chưa hoàn thành"; // Default to "Chưa hoàn thành"
  }
}

export function convertTaskStatus(task) {
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
}
