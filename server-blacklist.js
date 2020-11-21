const express = require("express");
const path = require("path");
var useragent = require("useragent");
// const request = require("r")
const connectDB = require("./config/db");
// const path = require("path");
const User = require("./models/UserAuth");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const request = require("request");
const app = express();
const bodyParser = require("body-parser");
const apikey = "0e5d2c7f52723ef13dde434e89d81d63";
app.use(bodyParser.json({ limit: "900mb" }));
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ limit: "900mb", extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Request-Headers", "GET, PUT, POST, DELETE");
  next();
});
let PORT = process.env.PORT || 3400;
app.listen(PORT, function () {
  console.log(`listening to requests on port ${PORT}`);
  connectDB();
});
app.use("/images", express.static("images"));
app.use("/static", express.static(__dirname + "/static"));
app.set("view engine", "ejs");

app.get("/unsub", async (req, res) => {
  res.render("unsub.ejs");
});

app.post("/api/bulkget", async (req, res) => {
  let phoneList = req.body.phones;
  const response = await connectToBlacklist(phoneList);
  res.json(response);
});

async function DOWNLOADSUPPRESSION() {
  return new Promise((resolve, reject) => {
    let options = {
      url: `http://159.89.55.0:1531/api/downloadsuppression`,
      method: "GET",
    };
    request(options, function (error, response, body) {
      // console.log(error, response.statusCode)
      // if (!error && response.statusCode == 200) {
      console.log(body);
      //   resolve(body);
      // } else {
      resolve(body);
    });
  });
}

function connectToBlacklist(phoneList) {
  return new Promise((resolve, reject) => {
    request(
      {
        uri: `https://api.theblacklist.click/standard/api/v3/bulkLookup/key/${apikey}/response/json`,

        json: {
          phones: phoneList,
        },

        method: "POST",
      },
      function (error, response, body) {
        if (error) reject(error);
        if (body == "undefined") reject("undefined");
        else {
          resolve(body);
        }
      }
    );
  });
}
