import Express from "express";
import createHttpError from "http-errors";
import multer from "multer";
import uniqid from "uniqid";
import { getMedia, setMedia } from "../../lib/fs-tools.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const mediasRouter = Express.Router();

// POST
mediasRouter.post("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

// GET ALL
mediasRouter.get("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

// GET BY ID
mediasRouter.get("/:mediasId", async (req, res, next) => {
  try {
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
    } catch (error) {
      next(error);
    }
  }
);

export default mediasRouter;
