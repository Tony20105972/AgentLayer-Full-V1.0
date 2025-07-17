import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",  // ✅ Vercel 경로 오류 방지
  server: {
    host: "::",  // ✅ 외부 접근 허용 (로컬 테스트용)
    port: 8080,
  },
  plugins: [
    react(), // ✅ 필수 React SWC 플러그인
    // componentTagger() 제거됨
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),  // ✅ "@/components/..." 식으로 쓸 수 있게
    },
  },
}));
