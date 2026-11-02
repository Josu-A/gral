# Programazioan laguntzeko web-sistema, LLM eta MCP teknologietan oinarritua

Gradu Amaierako Lan (GrAL) honetan, programazio ikasleentzako web-plataforma bat
diseinatu eta inplementatu da. Hizkuntza-eredu Handiak (LLM) eta Model Context
Protocol (MCP) protokoloa erabiliz ikaskuntza autonomoa sustatzen duen feedback
pedagogikoa eskaintzen du.

Ikasleek C, Java eta Python lengoaietako programazio-ariketak egin eta exekuta
ditzakete nabigatzailetik bertatik. Edozein momentutan, txatbot bati laguntza eska
diezaiokete. Ariketaren zailtasuna eta ikaslearen ikasketa-maila kontuan hartuta,
txatboak pista pertsonalizatuak ematen ditu, ikaslea erantzun egokira pixkanaka
gertutatu dadin, soluzioa zuzenean eman gabe.

## Arkitektura

Sistemak hiru geruzako bezero-zerbitzari arkitektura modularra jarraitzen du:

- **Bezeroa** (`bezeroa/`): React eta Tailwind bidez eraikitako frontenda, Monaco
  kode-editorea barne.
- **Zerbitzaria** (`zerbitzaria/`): Express eta TypeScript bidez eraikitako backenda,
  sistemaren orkestratzaile gisa jarduten duena. JWT bidezko kautotzea kudeatzen
  du, datu-basearekin komunikatzen da, eta HiTZ zentroak garatutako Latxa LLMari
  deitzen dio feedback pedagogikoa sortzeko.
- **Kode exekuzio MCP zerbitzaria** (`mcp/code-execution/`): ikasleen kodea Docker
  edukiontzi isolatuetan exekutatzen du, exekuzio-denborak mugatuz. Backendarekin
  bakarrik komunikatzen da, STDIO bidez, eta lengoaia bakoitzeko tresna bat eskaintzen
  dio: `run_c_exercise`, `run_java_exercise` eta `run_python_exercise`.

Datuak PostgreSQL datu-base batean gordetzen dira, Prisma bidez kudeatuta (`datu-basea/`).

## Demo-bideoa eta txostena

- [Demo-bideoa](Project%20Demo.mp4): plataformaren funtzionamendua erakusten duen
  bideoa.
- [Proiektuaren txostena](Project%20Report.pdf): GrALaren memoria osoa: aurrekariak,
  planifikazioa, betekizunak, arkitektura eta diseinua, inplementazioa eta ondorioak.

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
