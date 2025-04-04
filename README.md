## Khởi chạy thủ công:
* **Bước 1:** git clone https://github.com/LoDtus/BaseLifeTex.git
* **Bước 2:** npm i --legacy-peer-deps
* **Bước 3:** npm run dev

## Cài đặt với Docker:
* **Bước 1:** git clone https://github.com/LoDtus/BaseLifeTex.git
* **Bước 2:** npm i --legacy-peer-deps
* **Bước 3:** docker build -t lifetex-client:1.0.0 .
* **Bước 4:** Tạo file .env nếu chưa có
* **Bước 5:** docker run --env-file .env -p 5173:80 lifetex-client