const Slider = require("../models/Slider");
const cloudinary = require("../config/cloudinary");

/* ================= GET ACTIVE SLIDERS (PUBLIC) ================= */
exports.getSliders = async (_req, res) => {
  try {
    const sliders = await Slider.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: sliders,
    });
  } catch (error) {
    console.error("FETCH SLIDERS ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sliders",
    });
  }
};

/* ================= GET ALL SLIDERS (ADMIN) ================= */
exports.getAllSliders = async (_req, res) => {
  try {
    const sliders = await Slider.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: sliders,
    });
  } catch (error) {
    console.error("FETCH ALL SLIDERS ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sliders",
    });
  }
};

/* ================= CREATE SLIDER ================= */
exports.createSlider = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const { title, subtitle } = req.body;

    const slider = await Slider.create({
      title,
      subtitle,
      imageUrl: req.file.path, // cloudinary URL
      imagePublicId: req.file.filename, // cloudinary public id
      createdBy: req.user?.id,
    });

    res.status(201).json({
      success: true,
      data: slider,
    });
  } catch (error) {
    console.error("CREATE SLIDER ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: "Failed to create slider",
    });
  }
};

/* ================= UPDATE SLIDER ================= */
exports.updateSlider = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({
        success: false,
        message: "Slider not found",
      });
    }

    // ✅ If new image uploaded → delete old image from cloud
    if (req.file) {
      if (slider.imagePublicId) {
        await cloudinary.uploader.destroy(slider.imagePublicId);
      }

      slider.imageUrl = req.file.path;
      slider.imagePublicId = req.file.filename;
    }

    slider.title = req.body.title ?? slider.title;
    slider.subtitle = req.body.subtitle ?? slider.subtitle;
    slider.isActive = req.body.isActive ?? slider.isActive;

    await slider.save();

    res.status(200).json({
      success: true,
      data: slider,
    });
  } catch (error) {
    console.error("UPDATE SLIDER ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: "Failed to update slider",
    });
  }
};

/* ================= DELETE SLIDER ================= */
exports.deleteSlider = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({
        success: false,
        message: "Slider not found",
      });
    }

    // ✅ Delete image from cloud
    if (slider.imagePublicId) {
      await cloudinary.uploader.destroy(slider.imagePublicId);
    }

    await slider.deleteOne();

    res.status(200).json({
      success: true,
      message: "Slider deleted successfully",
    });
  } catch (error) {
    console.error("DELETE SLIDER ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete slider",
    });
  }
};