const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const customerModel = require("./models/customer.js");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/clickEatDB");
}
let port = process.env.PORT || 3000;
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/customer", (req, res) => {
  res.sendFile(path.join(__dirname, "views/signin.html"));
});
app.get("/customer/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views/signup.html"));
});
app.get("/customer/home", (req, res) => {
  res.send("This is the home page");
});

app.post("/customer/signup", (req, res) => {
  let { username, email, phone, password, confirmPassword } = req.body;
  if (password != confirmPassword) {
    //password not matching with confirmPassword
    res.redirect("/customer/signup");
  } else {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        const newUser = new customerModel({
          username: username,
          email: email,
          password: hash,
          phone: phone,
        });
        newUser.save().then((user) => {
          if (user) {
            //user saved successfully
            res.redirect("/customer");
          } else {
            //user not saved successfully
            res.redirect("/customer/signup");
          }
        });
      });
    });
  }
});

app.post("/customer", (req, res) => {
  let { email, password } = req.body;
  customerModel
    .findOne({
      email: email,
    })
    .then((user) => {
      if (user) {
        //user found
        bcrypt.compare(password, user.password).then((result)=>{
          if(result){
            //password matches
            res.redirect("/customer/home");
          }
          else{
            //wrong password
            res.redirect("/customer");
          }
        })
      } else {
        //user not found
        res.redirect("/customer");
      }
    });
});
app.listen(port, () => {
  console.log("App is started at port " + port);
});
