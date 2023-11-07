const jwt = require("jsonwebtoken");
const user = require("../modales/userModel");

//user access
const verifyUser = (req, res, next) => {
  const authToken = req.header("Authorization");
  if (!authToken) {
    return res.status(404).json({ error: "Login required!" });
  }
  jwt.verify(authToken, process.env.JWT_SECRET, (error, payload) => {
    if (error) {
      return res.status(401).json({ error: "Login required!" });
    }
    const { _id } = payload;
    user.findById({ _id }).then((userData) => {
      req.user = userData;
      next();
    });
  });
};

//admin acceess
const isAdmin = async (req, res, next) => {
  try {
    const userInDB = await user.findById(req.user._id);
    if (userInDB.role !== 1) {
      return res.status(401).json({
        error: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(501).send({
      error: "Internal server error!",
    });
  }
};

module.exports = { verifyUser, isAdmin };
