var express=require("express"); 
var bodyParser=require("body-parser"); 
var app=express();
const mongoose = require('mongoose');
var User=require('./models/User.js');
var path = require("path");
const router=express.Router();
const {check,validationResult} = require('express-validator');
var ObjectId = require('mongodb').ObjectId 
var expressValidator = require('express-validator');
var expressSession = require('express-session');
const multer = require('multer');
var flash = require('connect-flash');
app.use(flash()); // flash messages



//flash
var flash = require('express-flash-messages');
const { Router } = require("express");
const { userInfo } = require("os");
app.use(flash());

//ejs
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');
app.use(bodyParser.json()); 
const urlencodedParser = bodyParser.urlencoded({ extended:false})

// list or get
router.get('/register',function (req, res) {
  var result;
  var error={};
  User.find({},function(err,result){
   
  res.render('pages/register',{result:result,error:error});
  //req.session.errors = null;
});

});

router.get('/userdetails',function (req, res) {
  var result;
  User.find({},function(err,result){

     res.render('pages/userdetails',{result:result});

});
});
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, "public");
  },
  filename: function (req, file, cb) {
  cb(null, Date.now() + "-" + file.originalname);
  },
  });
  
   var upload = multer({ storage: storage });

  //post 
  router.post('/register', [
    check('email', 'email is required').isEmail(),
    check('name', 'name is required').not().isEmpty(),
    check('password', 'password is required').not().isEmpty(),
  ], function(req, res, next) {  //check validate data
    const result= validationResult(req);
    var errors = result.errors;  for (var key in errors) {
          console.log(errors[key].value,'not validated');
    }
  
    if (!result.isEmpty()) {
    //response validate data to register.ejs
    console.log('validated')
       res.render('pages/register', {
        errors: errors
      })
    } else{
      // console.log('success')
      new User({
                username    : req.body.uname,
                email    : req.body.email,
                password : req.body.pwd,
                phone   : req.body.mnumber,
                images : req.file.filename
              })
              .save(function(err, doc){

                if(err){
                          console.log('sucess')
                       }else{
                          res.redirect('/userdetails')
                          
                     
                       }


            });
          }
    
    });
  

  





  // router.post('/register',upload.single('profile_pic'),function(req,res){ 
  //   console.log(req.body,'register');
  //   console.log(req.file.filename,'upload')
  //     new User({
  //         username    : req.body.uname,
  //         email    : req.body.email,
  //         password : req.body.pwd,
  //         phone   : req.body.mnumber,
  //         images : req.file.filename
  //       })
  //       .save(function(err, doc){
         
  //      if(err){
  //         console.log('sucess')
  //      }else{
  //         res.redirect('/userdetails')
          
     
  //      }
  // });
  // });

    //delete 
    router.get('/delete/(:id)',(req,res)=>{
      console.log('delete',req.params.id)
      var o_id = new ObjectId(req.params.id)

      User.find({"_id": o_id},function(err,result){

        User.deleteOne({"_id": o_id}, function(err) { 
     console.log('collection removed') 
});
        //console.log(result,'deleted')
       //console.log(err,'not deleted')
       res.render('pages/userdetails',{result:result});
      
      });
 });

   //edit
   router.get('/edit/(:id)',function (req, res) {
    var result;
    var o_id = new ObjectId(req.params.id)
    User.find({"_id": o_id},function(err,result){
     console.log(result,'successfull!!')
      if(!result){
                     console.log("not found")
                   } else{
                    
                    res.render('pages/edit',{ 
                      title: 'Edit User',            
                      _id: result[0]._id,
                       username: result[0].username,
                       password: result[0].password,
                      phone: result[0]. phone,
                      email:result[0].email   
                      
                  });
      
                    console.log("result")
                }
       
    })
    
  });
 // post for edit page
  router.post('/edit/(:id)',function(req,res){
    var result;
    var o_id = new ObjectId(req.params.id)
     var update = {
          _id:o_id,
          username:req.body.uname,
          phone: req.body.mnumber,
          password:req.body.pwd,
          email:req.body.email
     }

   
      User.update({ _id:o_id}, { $set: update }, function (err, result) {
        console.log(result)
        console.log(err,'error')
        if (err) {
        return res.status(400).json({ message: "Unable to update user." });
        } else {
        return res.redirect('/userdetails')      
        }
        });
        
    
        
    
    })


    

    module.exports=router;