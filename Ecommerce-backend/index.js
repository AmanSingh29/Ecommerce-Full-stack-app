const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

//dependencies
app.use(express.json());
app.use(cors());

//configure env
dotenv.config();

//connection to db
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("db connected");
  } catch (error) {
    console.log(`Error in connecting db ${error}`);
  }
};
connectDb();

//importing models
require("./modales/userModel");
require("./modales/categoryModel");
require("./modales/productModel");
require("./modales/orderModal");

//importing routes
app.use("/auth", require("./routes/auth"));
app.use("/category", require("./routes/categoryRoute"));
app.use("/product", require("./routes/productRoutes"));
app.use("/order", require("./routes/orderRoutes"));

//listening app on server
app.listen(process.env.port, () => {
  console.log("Server has started");
});
