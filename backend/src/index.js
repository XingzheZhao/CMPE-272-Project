const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const accounts = require("./routes/accounts");
const items = require("./routes/items");
const records = require("./routes/records");

const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use("/accounts", accounts);
app.use("/items", items);
app.use("/records", records);

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: 3306,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

db.connect(function (err) {
  if (err) throw err;
  app.get("/", (req, res) => {
    res.send("Connected to Database.");
  });
  console.log("Connected to Database");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, (err) => {
  if (err) console.log("Error, server cannot start", err);
  else console.log("Server Connected, and running in PORT: " + PORT);
});

module.exports = { app, db };
