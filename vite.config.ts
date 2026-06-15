import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteCompression from "vite-plugin-compression";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tanstackStart(), react(), tailwindcss(), tsconfigPaths(), viteCompression()],
  ssr: {
    external: ["lucide-react"],
  },
});
