const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folder = "event-platform/others";

    // ✅ Different folder for different routes
    if (req.baseUrl.includes("events")) {
      folder = "event-platform/events";
    }

    if (req.baseUrl.includes("sliders")) {
      folder = "event-platform/sliders";
    }

    return {
      folder,
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      public_id: Date.now() + "-" + file.originalname,
    };
  },
});

const upload = multer({ storage });

module.exports = upload;