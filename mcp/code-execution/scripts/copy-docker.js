import { cp } from "node:fs/promises";
import { join, resolve } from "node:path";

const rootDir = resolve(import.meta.dirname, "..");
const sourceDir = join(rootDir, "src", "docker");
const targetDir = join(rootDir, "dist", "docker");

await cp(
    sourceDir,
    targetDir,
    { force: true, recursive: true }
);