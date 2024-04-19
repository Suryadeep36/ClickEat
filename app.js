require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const customerModel = require("./models/customer.js");
const bodyParser = require("body-parser");
const menu = require("./menu.json")
const passport = require("passport")
const session = require('express-session');
const flash = require('connect-flash');
const sendMail = require('./utils/mailSender.js')

async function main() {
  await mongoose.connect(`mongodb+srv://gohilsuryadeep3101:${process.env.DB_PASS}@cluster0.3uef2pj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
  console.log("DB connected successfully")
}

main().catch((err) => console.log(err));
let port = process.env.PORT || 3000;
app.set('view engine', 'ejs');


app.use(session({
  secret: 'cheezy_seven_pizza',
  resave: true, 
  saveUninitialized: true 
}))

passport.use(customerModel.createStrategy());
passport.serializeUser(customerModel.serializeUser());
passport.deserializeUser(customerModel.deserializeUser());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

app.get("/", (req,res) => {
  res.sendFile(path.join(__dirname, "/views/front.html"));
})
app.get("/customer", (req, res) => {
  res.render("signin", {msg: req.flash('msg')})
});
app.get("/customer/signup", (req, res) => {
  let message = req.flash('msg');
  res.render("signup",{msg: message})
});
app.get("/staff", (req, res) => {
  let message = req.flash('msg');
  res.render("staff_signin",{msg: message})
});
app.get("/staff/dashboard",checkAuthentication,(req, res) => {
  if(req.user.role != "staff"){
    res.redirect("/customer/home");
  }
  else{
    res.send("Dashboard for staff");
  }
});
app.get("/customer/home",checkAuthentication,(req, res) => {
  res.sendFile(path.join(__dirname, "/views/main.html"));
});
app.get("/customer/cart",checkAuthentication,(req,res) => {
  res.render("cart",{
    selectedItems: req.user.choosenItems
  });
})
app.get("/customer/signout",(req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/customer');
  });
})
app.get("/customer/:id",checkAuthentication,(req, res) => {
  let found;
  menu.map((ele)=>{
    if(ele.type.toLowerCase().replace(/\s/g, "") === req.params.id){
      found = ele;
    }
  }
  )
  if(found){
    res.render("section",{
      foodType: found.type,
      foodItems: found.items
    })
  }
  else{
    res.redirect("/customer/home")
  }
})


app.post("/customer/cart", checkAuthentication,(req, res) => {
  customerModel.findOne({email: req.user.email}).then((user)=> {
    if(Array.isArray(user.choosenItems) && user.choosenItems.length){
      req.body.map((ele) => {
       let result =  user.choosenItems.find((item) => item.id == ele.id)
        if(result){
          result.quantity+= ele.quantity;
        }
        else{
          user.choosenItems.push(ele);
        }
      })
      user.save();
    }
    else{
      user.choosenItems = req.body;
      user.save();
    }
  })
  res.status(200).send("Data Shared!!");
})


app.post("/customer/signup", (req, res) => {
  let { username, email, phone, password, confirmPassword } = req.body;
  if (password != confirmPassword) {
    //password not matching with confirmPassword
    res.redirect("/customer/signup");
  }
  customerModel.register(
    new customerModel({ 
      username: username ,
      email: email, 
      phone: phone,
      role: "customer"
    }), password, function (err, msg) {
      if (err) {
        //user already exists
        req.flash('msg', 'user already exists')
        res.redirect("/customer/signup");
      } else {
        //success
        sendMail(username, email);
        res.redirect("/customer")
      }
    }
  )
});

app.post("/customer", (req, res) => {
  passport.authenticate("local", (err,user, info) => {
    if(!user){
      if(info.name == "IncorrectPasswordError"){
        //wrong password
        req.flash('msg', 'Wrong Password')
        res.redirect("/customer");
      }
      else if(info.name == "IncorrectUsernameError"){
        //wrong username
        req.flash('msg', '*User Not Found')
        res.redirect("/customer")
      }
    }
    else{
      req.login(user, function(err) {
        if (err) { return next(err); }
        return res.redirect("/customer/home");
      });
    }
  })(req, res)
  });

app.post("/staff",(req, res) => {
  passport.authenticate("local", (err,user, info) => {
    if(!user){
      if(info.name == "IncorrectPasswordError"){
        //wrong password
        req.flash('msg', 'wrong password')
        res.redirect("/staff");
      }
      else if(info.name == "IncorrectUsernameError"){
        //wrong username
        req.flash('msg', 'username not found')
        res.redirect("/staff")
      }
    }
    else{
      req.login(user, function(err) {
        if (err) { return next(err); }
        if(user.role == "staff"){
          return res.redirect("/staff/dashboard");
        }
        return res.redirect("/customer")
      });
    }
  })(req, res)
})


function checkAuthentication(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    else{
      res.redirect("/");
    }
}
app.listen(port, () => {
  console.log("App is started at port " + port);
});
