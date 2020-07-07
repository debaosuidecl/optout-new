const express = require("express");
const multer = require("multer");
let socket = require("socket.io");
const csvtojson = require("csvtojson");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const app = express();
// connectDB();
let cors = require("cors");

app.use(cors());

app.use(express.json());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public-beta");
  },
  filename: function (req, file, cb) {
    cb(null, "file-formatted.csv");
  },
});

var upload = multer({ storage: storage }).single("file");

app.post("/api/upload", (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    console.log(req.file);
    res.send("success");
    //  res.status(200).send(req.file)
  });
});
app.get("/api/blah", (req, res) => {
  res.send("blah");
});
// ROUTE post to /upload
// DESC upload file to DB
// app.post("/api/upload", upload.single("file"), (req, res) => {
//   res.json({ file: req.file });
//   console.log(req.file);
//   // res.send("success");
// });

let server = app.listen(4321, () => console.log("connect to 4321"));
const io = socket(server);

io.on("connection", (socket, id) => {
  console.log("connected", socket.id);
});
