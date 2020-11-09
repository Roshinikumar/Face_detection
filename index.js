const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const employeerouter=require('./routers');
const app=express(); 
var path = require("path");

//db
mongoose.connect("mongodb://localhost:27017/mydb",{ useNewUrlParser: true ,useUnifiedTopology: true }, (err)=>{
    if(!err){
        console.log("db connected successfully!!");
    }
    else{
        console.log("not connected");
    }
})
//ejs

app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');


app.use(bodyParser.json()); 
var uploadsDir = './public/';
app.use(express.static(path.join(__dirname, uploadsDir)));

app.use(bodyParser.urlencoded({ 
  extended: true
}));

app.use(async function (req, res, next) {
  res.locals = {};
  res.locals.session = req.session;
  // console.log('res.locals : ',res.locals);
  next();
});



app.use('/',employeerouter);

//listen port
app.listen(5000,()=>{
    console.log("server started");
})