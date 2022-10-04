const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;
const userRoutes = require("./routes/user");
const itemRoutes = require("./routes/item");
const categoryRoutes = require("./routes/category");
const kilnRoutes = require("./routes/kiln_process");
const levelRoutes = require("./routes/level");
const transactionRoutes = require("./routes/transaction");
const saleRoutes = require("./routes/sale");
const dashboardRoutes = require("./routes/dashboard");
const documentRoutes = require("./routes/document");
const db = require("./config/database");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-auth-token");
  next();
});

app.use("/users", userRoutes);
app.use("/items", itemRoutes);
app.use("/level", levelRoutes);
app.use("/category", categoryRoutes);
app.use("/kiln", kilnRoutes);
app.use("/transaction", transactionRoutes);
app.use("/sale", saleRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/download", documentRoutes);

app.listen(port, async () => {
  try {
    await db.authenticate();
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
  console.log(`Example app listening on port ${port}`);
});
