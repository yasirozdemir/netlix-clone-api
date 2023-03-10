import imageToBase64 from "image-to-base64";
import PdfPrinter from "pdfmake";
import { pipeline } from "stream";
import { promisify } from "util";
import { getPDFWritableStream } from "./fs-tools.js";

export const mediaToPDF = async (media) => {
  const posterURLToBase64 = await imageToBase64(media.poster);
  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };
  const printer = new PdfPrinter(fonts);
  const docDefinition = {
    content: [
      {
        image: `data:image/jpeg;base64,${posterURLToBase64}`,
        width: 350,
      },
      {
        text: [media.title],
        bold: true,
        margin: [0, 20, 0, 0],
        fontSize: 24,
      },
      {
        text: [media.year],
      },
      {
        text: [media.type],
      },
    ],
    defaultStyle: {
      font: "Helvetica",
      alignment: "center",
    },
  };
  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
  pdfReadableStream.end();
  return pdfReadableStream;
};

export const mediaToPDFAsync = async (media) => {
  const source = await mediaToPDF(media);
  const destination = getPDFWritableStream(`${media.id}.pdf`);
  const promiseBasedPipeline = promisify(pipeline);
  await promiseBasedPipeline(source, destination);
};
