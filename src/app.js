const express = require("express");
const app = express();
const offersInfo = require("./routes/offers");

app.use(express.json());
app.use("/",offersInfo);

module.exports = app;