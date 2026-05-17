import { cpSync } from "fs";
import { isAbsolute, resolve } from "path";
import { defineConfig } from "tsup";

const TS_ALIASES = new Set(["app", "common", "domain", "infra", "routers"]);

function isExternalNodeModule(path: string): boolean {
    if (path.startsWith(".") || path.startsWith("node:") || isAbsolute(path)) {
        return false;
    }
    if (path.startsWith("@")) {
        const firstDirName = path.slice(1).split(/[\\/]/)[0];
        if (TS_ALIASES.has(firstDirName)) {
            return false;
        }
    }
    return true;
}

export default defineConfig({
    clean: true,
    entry: ["src/main.ts"],
    esbuildOptions: (options, _) => {
        options.alias = {
            "@": resolve(import.meta.dirname, "src"),
        };
    },
    esbuildPlugins: [
        {
            name: "externalize-node-modules",
            setup: (build) => {
                build.onResolve({ filter: /.*/ }, (args) => {
                    if (args.kind === "entry-point") {
                        return;
                    }
                    if (isExternalNodeModule(args.path)) {
                        return {
                            external: true,
                            path: args.path,
                        };
                    }
                    return;
                });
            },
        },
    ],
    format: "esm",
    onSuccess: async () => {
        cpSync(
            resolve(import.meta.dirname, "src/infra/prompts"),
            resolve(import.meta.dirname, "dist/prompts"),
            { recursive: true },
        );
    },
    splitting: true,
    tsconfig: "tsconfig.prod.json",
});
