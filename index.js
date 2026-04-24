require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const app = express();



app.use(helmet());
app.use(cors());
app.use(xss());
app.use(express.json());
app.use("/auth", require("./src/routes/auth.route"));
app.use("/products", require("./src/routes/product.routes"));
app.use("/uploads", require("express").static("uploads"));
app.use("/upload", require("./src/routes/upload.route"));

app.listen(3000, () => console.log("Server running on 3000"));