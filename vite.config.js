import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ["muuri"],
  },
  server: {
    host: true, // 👈 Cho phép truy cập từ IP nội bộ (LAN)
    port: 5173, // 👈 Có thể thêm dòng này nếu muốn chắc chắn dùng đúng port
  },
});
