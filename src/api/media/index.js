import Express from "express";
import createHttpError from "http-errors";
import multer from "multer";
import uniqid from "uniqid";
import { getMedias, setMedias } from "../../lib/fs-tools.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

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
    res.send(foundedMedia);
  } catch (error) {
    next(error);
  }
});

// PUT
mediasRouter.put("/:mediasId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

// DELETE
mediasRouter.delete("/:mediasId", async (req, res, next) => {
  try {
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
  "/:mediasId/cover",
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

export default mediasRouter;
