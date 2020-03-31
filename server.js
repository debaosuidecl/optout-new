
const express = require("express");
const path = require("path")
var useragent = require("useragent");
// const request = require("r")
const connectDB = require("./config/db");
// const path = require("path");
const User = require("./models/UserAuth");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const request = require("request")
const app = express();
const bodyParser = require("body-parser")
app.use(bodyParser.json({ limit: "900mb" }));
app.set('views',path.join(__dirname ,'views'));
app.use(bodyParser.urlencoded({ limit: "900mb", extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Request-Headers", "GET, PUT, POST, DELETE");
  next();
});
let PORT =  process.env.PORT || 3000
app.listen(PORT, function() {
    console.log(`listening to requests on port ${PORT}`);
    connectDB();
  });
  app.use("/images", express.static("images"));
  app.use('/static', express.static(__dirname + '/static'));
  app.set("view engine", "ejs");




app.get("/", (req,res)=> {
    res.render("home.ejs");

})

app.get("/download-suppression", async (req,res)=> {
  let  data =  await DOWNLOADSUPPRESSION()
  console.log(data);
  res.send(data)
})



app.post(
  "/api/register",
 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // if there are errors
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { username, password } = req.body;

    try {
      // we want to see if the user exist

      // get User's gravatar

      // encrypt the password using bcrypt

      // return a jsonwebtoken so that the user can be logged in immediately

      let user = await User.findOne({ username });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User Already Exists" }] }); //bad request
      }
      // const avatar = gravatar.url(email, {
      //   s: '200', // default size
      //   r: 'pg', // rating - cant have any naked people :)
      //   d: 'mm' // gives a default image
      // });
      user = new User({
        username,
        email: "test2@gmail.com",
        // avatar,
        password
        // phone: phoneNumber
      });
      console.log(user);
      // return;
      const salt = await bcrypt.genSalt(10); // create the salt
      user.password = await bcrypt.hash(password, salt); // to encrypt the user password

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "10h" },
        (error, token) => {
          if (error) throw error;

          res.json({ token, username: user.username });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).send("Server Error");
    }
  }
);







  app.post(
    '/signin',
  
    async (req, res) => {
        console.log(req.body)
        // return
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }
  
      const { username, password } = req.body;
      
      try {
        // we want to check to see if there is no user. if there isn't we send an error
  
        let user = await User.findOne({ username });
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Incorrect username or password entered.' }] }); //bad request
        }
  
        const isMatch = await bcrypt.compare(password, user.password); // first arg is plain text password from request, second is the encrypted password, we want to check if these 2 match
  
        if (!isMatch) {
          // if it doesn't match
          return res
            .status(400)
            .json({ errors: [{ msg: 'Incorrect username or password entered. ' }] }); //bad request
        }
        console.log('just about');
  
        const payload = {
          user: {
            id: user.id
          }
        };
  
        jwt.sign(payload, config.get('jwtSecret'), null, (error, token) => {
          if (error) throw error;
  
          res.json({
            token,
            username: user.username,
            fullName: user.fullName,
            _id: user.id
          });
        });
      } catch (e) {
        console.error(e);
        res.status(500).json({
          errors: [
            {
              msg: 'A server error occured'
            }
          ]
        });
      }
    }
  );
app.get("/unsub", async (req, res) => { 
  res.render("unsub.ejs");
})

app.get("/login", async (req, res) => { 
    res.render("index.ejs");
  })

app.get("/success", async (req, res)=> {
    res.render("success.ejs");
})

app.get("/send-to-power", async (req, res)=> {
    const {phone, email} = req.query;
    try {
        let deba = await ACCESS_HOST(phone, email);
        console.log(deba)
        if(deba == 301){
            return res.json({
                success: true,
                msg: "You are now unsubscribed"
            })
        }
        res.json({
            success: true
        })
        
    } catch (error) {
            console.error(error)
        // await ACCESS_HOST(phone, email);
        res.status(error).json({
            success: false
        })
    }
})


async function ACCESS_HOST(phone,email) {
  return new Promise((resolve, reject) => {
    let options = {
      url: `http://159.89.55.0:1531/api/pingoptout?phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}`,
      method: "GET",

    };
    request(options, function(error, response, body) {
        // console.log(error, response.statusCode)
      // if (!error && response.statusCode == 200) {
      //   // console.log(body);
      //   resolve(body);
      // } else {
        if(response.statusCode === 200){
            
                resolve(body)
        } 
            else if(response.statusCode === 301){
                resolve(301)
            }
        else{
            reject(response.statusCode, body)
        }
    });
  });
}


async function DOWNLOADSUPPRESSION() {
    return new Promise((resolve, reject) => {
      let options = {
        url: `http://159.89.55.0:1531/api/downloadsuppression`,
        method: "GET",
  
      };
      request(options, function(error, response, body) {
          // console.log(error, response.statusCode)
        // if (!error && response.statusCode == 200) {
          console.log(body);
        //   resolve(body);
        // } else {
        resolve(body)
      });
    });
  }
  