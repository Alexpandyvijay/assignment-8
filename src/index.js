const mongoose = require("mongoose");
const app = require("./app");

require('dotenv').config;
mongoose.connect("mongodb://127.0.0.1:27017/game", {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));


app.listen(3000 , console.log('server is running.......'));
