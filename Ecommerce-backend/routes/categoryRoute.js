const express = require("express");
const Category = require("../modales/categoryModel");
const { verifyUser, isAdmin } = require("../middleware/verifyUser");
const router = express.Router();
const slugiFy = require("slugify");

//api to create category
router.post("/create-category", verifyUser, isAdmin, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(401).json({ error: "One or more fields are mandatory!" });
  }
  const categortInDb = await Category.findOne({ name });
  if (categortInDb) {
    return res.status(404).json({ error: "Category Already Exist!" });
  }
  const newCat = await new Category({ name, slug: slugiFy(name) }).save();
  return res.status(200).json({
    success: "New Category Created",
    data: newCat,
  });
});

//api to update category
router.put("/update-category/:id", verifyUser, isAdmin, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(401).json({ error: "One or more fields are mandatory!" });
  }
  const newCat = await Category.findByIdAndUpdate(
    req.params.id,
    { name, slug: slugiFy(name) },
    { new: true }
  );
  return res.status(201).json({
    success: "Category Updated Successfully",
    data: newCat,
  });
});

//get all category
router.get("/get-category", async (req, res) => {
  const allCat = await Category.find();
  return res.status(200).json({
    data: allCat,
  });
});

//get a single category
router.get("/get-category/:slug", async (req, res) => {
  const cat = await Category.findOne({ slug: req.params.slug });
  return res.status(200).json({
    data: cat,
  });
});

//api to delete a category
router.delete("/delete-category/:id", verifyUser, isAdmin, async (req, res) => {
  const cat = await Category.findByIdAndDelete({ _id: req.params.id });
  return res.status(200).json({
    success: "Category Deleted Successfully",
  });
});

module.exports = router;
