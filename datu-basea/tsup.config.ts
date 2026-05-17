import { defineConfig } from "tsup";

export default defineConfig({
    clean: true,
    dts: true,
    entry: ["src/index.ts", "src/browser.ts"],
    format: "esm",
    skipNodeModulesBundle: true,
    splitting: true,
    tsconfig: "tsconfig.prod.json",
});
