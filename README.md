# Programazioan laguntzeko web-sistema, LLM eta MCP teknologietan oinarritua

## Garapena

### Beharrezkoak

- Node.js >= 24
- PostgreSQL datu-basea instalatuta.
- Docker

### Instalazioa

1. Proiektua klonatu:

    ```bash
    git clone https://github.com/Josu-A/gral.git
    ```

2. Direktorioa aldatu:

    ```bash
    cd gral
    ```

3. Ingurune aldagaiak konfiguratu: `.env.example` fitxategia kopiatu karpeta berdinean eta `.env.development` izena eman.

    ```bash
    cp .env.example .env.development
    ```

    Fitxategi berrian, aldatu `JWT_ACCESS_SECRET` eta `JWT_REFRESH_SECRET` balioak (luzeera handikoak izan behar dira), Latxa LLMarekin konektatzeko `API_KEY_LATXA`, `API_URL_LATXA` eta `API_MODEL_LATXA` balioak zehaztu, eta datu-basearekin konektatzeko `DB_URL` balioa eguneratu.
    - `USER`: datu-basea jabetzat duen erabiltzailearen izena.
    - `PASSWORD`: datu-basea jabetzat duen erabiltzailearen pasahitza.
    - `HOST`: datu-basearen host-a (adibidez, `localhost`).
    - `PORT`: datu-basearen portua (adibidez, `5432`).
    - `DATABASE`: datu-basearen izena.

4. Beharrezko paketeak instalatu:

    ```bash
    npm install
    ```

5. Datu-basea sortu, prisma bezeroa eraiki eta hasierako datuak sortu:

    ```bash
    npm run db:migrate:seed
    ```

6. MCP zerbitzariak eraiki:

    ```bash
    npm run build:mcp
    ```

7. Zerbitzariak abiarazi:

    ```bash
    npm run dev
    ```

> [!WARNING]
> Windows erabiliz gero, `npm run build:mcp:windows` eta `npm run dev:windows` komandoak erabili behar dituzu.
