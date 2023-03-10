import Express from "express";
import createHttpError from "http-errors";
import multer from "multer";
import uniqid from "uniqid";
import { getMedias, setMedias } from "../../lib/fs-tools.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { mediaToPDF, mediaToPDFAsync } from "../../lib/pdf-tools.js";
import { pipeline } from "stream";

const mediasRouter = Express.Router();

// POST
mediasRouter.post("/", async (req, res, next) => {
  try {
    const medias = await getMedias();
    const newMedia = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: uniqid(),
    };
    medias.push(newMedia);
    await setMedias(medias);
    res.status(201).send({
      success: "true",
      message: "Media successfully created!",
      mediaId: newMedia.id,
    });
  } catch (error) {
    next(error);
  }
});

// GET ALL
mediasRouter.get("/", async (req, res, next) => {
  try {
    const medias = await getMedias();
    res.send(medias);
  } catch (error) {
    next(error);
  }
});

// GET BY ID
mediasRouter.get("/:mediasId", async (req, res, next) => {
  try {
    const medias = await getMedias();
    const foundedMedia = medias.find((m) => m.id === req.params.mediasId);
    if (foundedMedia) res.send(foundedMedia);
    else
      next(
        createHttpError(404, `Media with id ${req.params.mediasId} not found!`)
      );
  } catch (error) {
    next(error);
  }
});

// PUT
mediasRouter.put("/:mediasId", async (req, res, next) => {
  try {
    const medias = await getMedias();
    const index = medias.findIndex((m) => m.id === req.params.mediasId);
    if (index !== -1) {
      const updatedMedia = {
        ...medias[index],
        ...req.body,
        updatedAt: new Date(),
      };
      medias[index] = updatedMedia;
      await setMedias(medias);
      res.send({ success: true, updatedMedia: updatedMedia });
    } else {
      next(
        createHttpError(404, `Media with id ${req.params.mediasId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

// DELETE
mediasRouter.delete("/:mediasId", async (req, res, next) => {
  try {
    const medias = await getMedias();
    const remainingMedias = medias.filter((m) => m.id !== req.params.mediasId);
    if (remainingMedias.length < medias.length) {
      await setMedias(remainingMedias);
      res
        .status(204)
        .send({ success: true, message: "Media succesfully deleted!" });
    } else {
      next(
        createHttpError(404, `Media with id ${req.params.mediasId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "netflix/medias/poster",
    },
  }),
}).single("poster");

// POST A POSTER
mediasRouter.post(
  "/:mediasId/poster",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      const medias = await getMedias();
      const index = medias.findIndex((m) => m.id === req.params.mediasId);
      if (index !== -1) {
        medias[index].poster = req.file.path;
        await setMedias(medias);
        res.status(201).send({
          success: "true",
          message: "Poster successfully added!",
          mediaId: req.params.mediasId,
        });
      } else {
        next(
          createHttpError(
            404,
            `Media with the id ${req.params.mediasId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

// CREATE PDF into DATA/PDFs
mediasRouter.get("/:mediasId/pdf/create", async (req, res, next) => {
  try {
    const medias = await getMedias();
    const foundedMedia = medias.find((m) => m.id === req.params.mediasId);
    if (foundedMedia) {
      await mediaToPDFAsync(foundedMedia);
      res.status(201).send({
        success: true,
        message: `PDF version of ${foundedMedia.title} created!`,
      });
    } else
      next(
        createHttpError(404, `Media with id ${req.params.mediasId} not found!`)
      );
  } catch (error) {
    next(error);
  }
});

// DOWNLOAD PDF
mediasRouter.get("/:mediasId/pdf/download", async (req, res, next) => {
  try {
    const medias = await getMedias();
    const foundedMedia = medias.find((m) => m.id === req.params.mediasId);
    if (foundedMedia) {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${foundedMedia.id}.pdf`
      );
      const source = await mediaToPDF(foundedMedia);
      const destination = res;
      pipeline(source, destination, (err) => {
        console.log(err);
      });
    } else
      next(
        createHttpError(404, `Media with id ${req.params.mediasId} not found!`)
      );
  } catch (error) {
    next(error);
  }
});

export default mediasRouter;
