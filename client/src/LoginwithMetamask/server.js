const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://Stonaboy:abc@cluster0.dshrzyu.mongodb.net/sloppy3?retryWrites=true&w=majority"
)
.then(() => console.log("データベース接続に成功しました"));

