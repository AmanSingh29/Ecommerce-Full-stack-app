const express = require("express");
const { verifyUser, isAdmin } = require("../middleware/verifyUser");
const router = express.Router();
const Order = require("../modales/orderModal");

//api to get all orders by users
router.get("/all-orders", verifyUser, isAdmin, async (req, res) => {
  const allOrders = await Order.find()
    .populate("buyer", "name")
    .populate("products", "-photo")
    .sort({ createdAt: -1 });
  return res.status(200).json({ data: allOrders });
});

//api to update status of a order
router.put("/update-status/:id", verifyUser, isAdmin, async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  return res
    .status(200)
    .json({ success: "Status Updated Successfully", data: order });
});

module.exports = router;
