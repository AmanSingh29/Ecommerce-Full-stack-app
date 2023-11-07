const express = require("express");
const router = express.Router();
const user = require("../modales/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { verifyUser } = require("../middleware/verifyUser");
const { isAdmin } = require("../middleware/verifyUser");

//register router
router.post("/register", async (req, res) => {
  const { name, email, phone, password, answer } = req.body;
  if (!name || !email || !phone || !password || !answer) {
    return res.status(401).json({ error: "One or more fields are mandatory!" });
  }
  let newuser = await user.findOne({ email });
  if (newuser) {
    return res.status(401).json({ error: "User already registered!" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(password, salt);
  newuser = await new user({
    name,
    email,
    phone,
    password: hashPass,
    answer,
  }).save();
  return res
    .status(200)
    .json({ success: "User registered seccessfully", result: newuser });
});

//update router
router.put("/update-user", verifyUser, async (req, res) => {
  const { name, phone, address } = req.body;
  if (!name || !phone) {
    return res.status(401).json({ error: "One or more fields are mandatory!" });
  }
  let newuser = await user.findByIdAndUpdate(
    req.user._id,
    { $set: { name, phone, address } },
    { new: true }
  );
  return res.status(200).json({
    success: "User updated successfully",
    result: {
      name: newuser.name,
      phone: newuser.phone,
      email: newuser.email,
      role: newuser.role,
      address: newuser.address,
    },
  });
});

//login router
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(401)
        .json({ error: "One or more fields are mandatory!" });
    }
    const userInDb = await user.findOne({ email });
    if (!userInDb) {
      return res.status(401).json({ error: "Invalid cradentials!" });
    }
    const passCompare = await bcrypt.compare(password, userInDb.password);
    if (!passCompare) {
      return res.status(401).json({ error: "Invalid cradentials!" });
    }
    const token = await jwt.sign(
      { _id: userInDb._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.status(200).json({
      success: "Login successfully",
      user: {
        name: userInDb.name,
        email: userInDb.email,
        phone: userInDb.phone,
        role: userInDb.role,
        address: userInDb.address,
      },
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
});

//api to reset password
router.post("/resetpass", async (req, res) => {
  try {
    const { email, answer, newPass } = req.body;
    if (!email || !answer || !newPass) {
      return res
        .status(401)
        .json({ error: "One or more fields are mandatory!" });
    }
    const userInDb = await user.findOne({ email, answer });
    if (!userInDb) {
      return res.status(401).json({ error: "Invalid cradentials!" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(newPass, salt);
    await user.findByIdAndUpdate(userInDb._id, { password: hashedPass });
    return res.status(200).json({ success: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error!" });
  }
});

router.get("/user-auth", verifyUser, (req, res) => {
  return res.status(200).send({ ok: true });
});

router.get("/admin-auth", verifyUser, isAdmin, (req, res) => {
  return res.status(200).send({ ok: true });
});

module.exports = router;
