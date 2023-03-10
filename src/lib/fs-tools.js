import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createWriteStream } from "fs";

const { readJSON, writeJSON } = fs;

export const dataFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data"
);
export const PDFsFolderPath = join(dataFolderPath, "/PDFs");
export const getPDFWritableStream = (filename) =>
  createWriteStream(PDFsFolderPath, filename);
export const mediaJSONPath = join(dataFolderPath, "media.json");
export const getMedias = () => readJSON(mediaJSONPath);
export const setMedias = (medias) => writeJSON(mediaJSONPath, medias);
