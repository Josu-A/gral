import { defineConfig } from "prisma/config";

import { environment } from "./src/env";

export default defineConfig({
    datasource: {
        url: environment.DB_URL,
    },
    migrations: {
        path: "src/migrations",
        seed: "tsx src/seed/index.ts",
    },
    schema: "src/",
});
