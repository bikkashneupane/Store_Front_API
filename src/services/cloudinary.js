import cloudinary from "cloudinary";
import fs from "fs";

// configure cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//function to upload images to Cloudinary and delete local file
export const cloudinaryUpload = async (filePath) => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: "vikiasmy-watches/users",
      allowed_formats: ["jpg", "png", "webp"],
    });
    fs.unlinkSync(filePath); //remove local file after successful cloudinary upload

    return result.secure_url; // attach image cloudinary url paths to req
  } catch (error) {
    throw new Error(error);
  }
};

// delete images from cloudinary
export const deleteCloudinaryImage = async (imagesToDelete) => {
  for (const img of imagesToDelete) {
    const publicId = img.split("/").pop().split(".")[0];
    await cloudinary.v2.uploader.destroy(publicId, { resource_type: "image" });
  }
  return;
};

// check the length of images uploaded to edit
export const validateImageCount = (req, res, next) => {
  try {
    const { images } = req.body;
    const newImagesCount = req.files?.length || 0;
    const totalImagesCount = (images ? images.length : 0) + newImagesCount;

    if (totalImagesCount > 1) {
      // Delete uploaded images from the express server
      req.files.forEach((image) => {
        fs.unlinkSync(image.path);
      });

      return res.status(400).json({
        status: "error",
        message: "Too many files uploaded, only 1 allowed",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
