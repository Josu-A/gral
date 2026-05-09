import Dockerode from "dockerode";
import { join } from "node:path";
import tar from "tar-fs";

import logger from "./common/logger.js";
import { cLanguage } from "./languages/c.js";
import { javaLanguage } from "./languages/java.js";
import { pythonLanguage } from "./languages/python.js";

const docker = new Dockerode();

const DOCKERFILE_NAME = "Dockerfile";
const dockerFilesPath = join(import.meta.dirname, "docker");

interface LanguageData {
    dockerfilePath: string;
    dockerImageName: string;
}

const LANGUAGE_DATA: Record<string, LanguageData> = {
    [cLanguage.id]: {
        dockerfilePath: join(dockerFilesPath, cLanguage.id, DOCKERFILE_NAME),
        dockerImageName: cLanguage.image,
    },
    [javaLanguage.id]: {
        dockerfilePath: join(dockerFilesPath, javaLanguage.id, DOCKERFILE_NAME),
        dockerImageName: javaLanguage.image,
    },
    [pythonLanguage.id]: {
        dockerfilePath: join(
            dockerFilesPath,
            pythonLanguage.id,
            DOCKERFILE_NAME,
        ),
        dockerImageName: pythonLanguage.image,
    },
};

async function buildImage(languageId: string): Promise<void> {
    const languageData = LANGUAGE_DATA[languageId];

    const imageExists = await checkImageExists(languageData.dockerImageName);
    if (imageExists) {
        logger.info(
            `Docker image for language "${languageId}" already exists. Skipping build.`,
        );
        return;
    }

    const buildContext = tar.pack(languageData.dockerfilePath);

    const stream = await docker.buildImage(buildContext, {
        t: languageData.dockerImageName,
    });

    await new Promise((resolve, reject) => {
        docker.modem.followProgress(
            stream,
            (err, res) => (err ? reject(err) : resolve(res)),
            (event) => logger.info(`[${languageId}] ${event}`),
        );
    });
}

async function buildImages(): Promise<void> {
    for (const languageId in LANGUAGE_DATA) {
        await buildImage(languageId);
    }
}

async function checkImageExists(imageName: string): Promise<boolean> {
    try {
        await docker.getImage(imageName).inspect();
        return true;
    } catch (err: unknown) {
        if (
            typeof err === "object" &&
            err !== null &&
            "statusCode" in err &&
            err.statusCode === 404
        ) {
            return false;
        }
        throw err;
    }
}

export { buildImages };
