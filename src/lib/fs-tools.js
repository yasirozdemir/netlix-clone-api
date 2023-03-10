import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile } = fs;

export const dataFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data"
);
export const mediaJSONPath = join(dataFolderPath, "media.json");
export const getMedia = () => readJSON(mediaJSONPath);
export const writeMedia = (medias) => writeJSON(mediaJSONPath, medias);
