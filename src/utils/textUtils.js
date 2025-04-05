// Hàm chuẩn hóa keyword nhập vào
export function normalizeString(str) {
    return str
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // Bỏ dấu cho keyword
};