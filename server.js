const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const customerDetailsRoutes = require("./MVC/customerDetailsRoutes");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_DB_URI = process.env.MONGO_DB_URI;

app.use(express.json());

mongoose.connect(MONGO_DB_URI)
.then(() => {
  console.log("MongoDB connected successfully");
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});

app.use("/customers", customerDetailsRoutes)

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
