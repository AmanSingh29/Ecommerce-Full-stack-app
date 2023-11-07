const express = require("express");
const { verifyUser, isAdmin } = require("../middleware/verifyUser");
const router = express.Router();
const Product = require("../modales/productModel");
const Category = require("../modales/categoryModel");
const Order = require("../modales/orderModal");
const formidable = require("express-formidable");
const fs = require("fs");
const slugify = require("slugify");
const braintree = require("braintree");

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//payment routes
//token
router.get("/braintree/token", async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, responce) {
      if (err) {
        return res.status(500).send(err);
      } else {
        return res.send(responce);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

//payment api
router.post("/braintree/payment", verifyUser, async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((item) => {
      total = total + item.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      async function (error, result) {
        if (result) {
          const order = await new Order({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          return res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//api to create a product
router.post(
  "/create-product",
  verifyUser,
  isAdmin,
  formidable(),
  async (req, res) => {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    if (!name || !description || !price || !category || !quantity) {
      return res
        .status(401)
        .json({ error: "One or more fields are mandatory!" });
    }
    const product = new Product({ ...req.fields, slug: slugify(name) });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    return res
      .status(201)
      .json({ success: "Product created successfully", data: product });
  }
);

//api to update a product
router.put(
  "/update-product/:id",
  verifyUser,
  isAdmin,
  formidable(),
  async (req, res) => {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    if (!name || !description || !price || !category || !quantity) {
      return res
        .status(401)
        .json({ error: "One or more fields are mandatory!" });
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    return res
      .status(201)
      .json({ success: "Product updated successfully", data: product });
  }
);

//get all products
router.get("/get-product", async (req, res) => {
  const products = await Product.find({})
    .populate("category")
    .select("-photo")
    // .limit(12)
    .sort({ createdAt: -1 });
  return res.status(200).json({ count: products.length, data: products });
});

//api to get products by category
router.get("/get-products/:slug", async (req, res) => {
  try {
    const cat = await Category.findOne({ slug: req.params.slug });
    const products = await Product.find({ category: cat })
      .populate("category")
      .select("-photo");
    return res.status(200).json({ data: products, cat: cat });
  } catch (error) {
    return res.send(error);
  }
});

//get a single product
router.get("/get-product/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .select("-photo");
  return res.status(200).json({ data: product });
});

//api to get photo of product
router.get("/product-photo/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    return res.send(error);
  }
});

//api to detele a product
router.delete("/delete-product/:id", verifyUser, isAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id).select("-photo");
  return res.status(200).json({ success: "Product deleted successfully" });
});

//api to filter products
router.post("/filter-product", async (req, res) => {
  const { checked, radio } = req.body;
  let args = {};
  if (checked.length > 0) args.category = checked;
  if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
  const products = await Product.find(args);
  return res.status(200).json({ data: products });
});

//api to search products
router.get("/search-product/:keyword", async (req, res) => {
  const result = await Product.find({
    $or: [
      {
        name: { $regex: req.params.keyword, $options: "i" },
      },
      {
        description: { $regex: req.params.keyword, $options: "i" },
      },
    ],
  }).select("-photo");
  return res.json({ data: result });
});

//api to get ordered products
router.get("/my-order", verifyUser, async (req, res) => {
  const myOrders = await Order.find({ buyer: req.user._id })
    .populate("products", "name price slug")
    .populate("buyer", "name")
    .sort({ createdAt: -1 });
  return res.status(200).json({ data: myOrders });
});

module.exports = router;
