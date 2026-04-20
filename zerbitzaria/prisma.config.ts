import { defineConfig } from "prisma/config";

import { environment } from './src/common/constants/env';

export default defineConfig({
    datasource: {
        url: environment.DB_URL
    },
    migrations: {
        path: "src/infra/prisma/migrations",
        seed: "tsx src/infra/prisma/seed/index.ts"
    },
    schema: "src/infra/prisma/"
});
