import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        "android/**",
        "ios/**",
        "dist/**",
        "node_modules/**",
        "vitest.config.ts",
      ],
      provider: "v8",
      reporter: ["text", "html"],
    },
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
