const Slider = require("../models/Slider");
const cloudinary = require("../config/cloudinary");

/*
  ADMIN - CREATE SLIDER
*/
exports.createSlider = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const { title, subtitle, isActive } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const slider = await Slider.create({
      title,
      subtitle,
      image: req.file.path,
      cloudinaryId: req.file.filename,
      isActive: isActive ?? true,
    });

    res.status(201).json(slider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  GET ACTIVE SLIDERS (Public)
*/
exports.getSliders = async (req, res) => {
  try {
    const sliders = await Slider.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.json(sliders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  ADMIN - GET ALL SLIDERS
*/
exports.getAllSliders = async (req, res) => {
  try {
    const sliders = await Slider.find().sort({ createdAt: -1 });
    res.json(sliders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  ADMIN - UPDATE SLIDER
*/
exports.updateSlider = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({ message: "Slider not found" });
    }

    // If new image uploaded
    if (req.file) {
      // Delete old image
      if (slider.cloudinaryId) {
        await cloudinary.uploader.destroy(slider.cloudinaryId);
      }

      slider.image = req.file.path;
      slider.cloudinaryId = req.file.filename;
    }

    slider.title = req.body.title ?? slider.title;
    slider.subtitle = req.body.subtitle ?? slider.subtitle;
    slider.isActive = req.body.isActive ?? slider.isActive;

    await slider.save();

    res.json(slider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
  ADMIN - DELETE SLIDER
*/
exports.deleteSlider = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({ message: "Slider not found" });
    }

    if (slider.cloudinaryId) {
      await cloudinary.uploader.destroy(slider.cloudinaryId);
    }

    await slider.deleteOne();

    res.json({ message: "Slider deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};