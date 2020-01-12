var express = require('express');
const app = express();

const session = require('express-session');
var passport = require('passport');
var path = require('path');
const bodyParser = require('body-parser');
const router = express.Router();
var urlParser  = bodyParser.urlencoded({extended:false});
const mongo    =  require('mongodb');
var mongoUtil = require('./mongoConfig');
var ejs = require('ejs');
var fs = require('fs');

const gamesController = require('./controller/gamesController');
const userController = require('./controller/userController');
//import express from 'express';
//import path from 'path';
//import bodyParser from 'body-parser';

app.use(urlParser);
app.set('view engine','ejs');
app.set("views", __dirname + '/views');

//####################################################################################################################
//app.use(require('serve-static')(__dirname + '/../../public'));
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
//####################################################################################################################


const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const PORT = 3000;
server.listen(PORT);
console.log('Server is running');


//Sockets
const users = [];
const connections = [];

io.sockets.on('connection',(socket) => {
   connections.push(socket);
   console.log(' %s sockets is connected', connections.length);

   socket.on('disconnect', () => {
      connections.splice(connections.indexOf(socket), 1);
   });

   /*
   socket.on('sending message', (message) => {
      console.log('Message is received :', message);

      io.sockets.emit('new message', {message: message});
   });
   */
   socket.on('sending message', function(data) {
      io.sockets.emit('new game message',
         {message: data.message, game_id: data.game_id, user_id: data.user_id , user_name: data.user_name});
   });
});

//MongoDB
mongoUtil.connectToServer(function(err){
   app.listen(8888,function(){
       console.log("listening on 8888");
   });
})

//-----------------------Views Routes-----------------------------------------
var sess;


//Initial Route
app.get('/', function(req,res){
   if(sess) {
      res.render('menu', {sess: sess});
   }else{
      res.render('index');
   }
});


//GameBoard Routes
app.get('/board', (req, res) => {
   res.render('board');
});
app.get('/game=:game_id&&user=:user_id', (req, res) => {
   //Deixar os comentarios!!! (Necessario para correr testes com varios utilizadores)
   //if(sess.user._id == req.params.user_id){
      var data = req.params;
      //data.sess=sess.user;
      res.render('board', data);
   //}else{
   //  res.redirect('/');
   //}
});

//Login Routes
app.get('/login', (req, res) => {
   if(sess) {
      res.redirect('/');
   }else{
      res.render('login_form');
   }
});
app.post('/login', function(req, res){
   userController.getUsers(req.body.user_email,req.body.user_password,function(result){
      console.log("result: "+JSON.stringify(result));
      if(result!="Error getting user"){
         sess = req.session;
         sess.user = result;
         console.log("sess2: "+JSON.stringify(sess));
         res.redirect('/');
      }else{
         res.redirect('/login');
      }
   });
});

//Register Routes
app.get('/register', (req, res) => {
   if(sess) {
      res.redirect('/');
   }else{
      res.render('register_form');
   }
});
app.post('/register', function(req,res){
   userController.verifyName(req.body.user_name,function(result){
      if(result=="Error name exists"){
         console.log('There is already an account with this name');
         res.redirect('/register');
      }else{
         userController.verifyEmail(req.body.user_email,function(result){
            if(result=="Error email exists"){
               console.log('There is already an account with this email');
               res.redirect('/register');
            }else{
               userController.insertUser(req.body.user_name, req.body.user_email,req.body.user_password,function(result){
                  console.log("result: "+result);
                  if(result=="Error getting user"){
                     res.redirect('/register');
                  }else{
                     sess = req.session;
                     sess.user = result;
                     res.redirect('/');
                  }
               });
            }
         });
      }
   });
});

//Logout Route
app.get('/logout',(req,res) => {
   req.session.destroy((err) => {
      if(err) throw err;
      sess = null;
      res.redirect('/');
   });
});

//Game Options Routes
app.get('/gameOptions1', (req, res) => {
   if(sess) {

         res.render('gameOptions1', {sess: sess})

      } else{
         res.render('index');
      }
   });

app.get('/gameOptions2', (req, res) => {
   if(sess) {
      res.render('gameOptions2', {sess: sess})
   }else{
      res.render('index');
   }
});



//new Game Route

app.get('/newGame', (req, res) => {
   if(sess) {
      gamesController.insertGame(sess.user._id,function(result){
         console.log("result: "+result);
         if(result!="Error inserting game"){
            sess.game = result;

            res.redirect("game="+sess.game._id+">&&user="+sess.user._id);

            //res.render('gameOptions1', {sess: sess})

         }else{

         location.href = "/gameOptions1";
         }
      });
      } else{
         res.render('index');
      }
   });


//----------------Images Routes---------------------------------------
app.get('/miss.png', (req,res) =>{
   fs.readFile('miss.png',function (e, data) {
      res.send(data);
   })
});

app.get('/hit.png', (req,res) =>{
   fs.readFile('hit.png',function (e, data) {
      res.send(data);
   })
});

app.get('/boat.png', (req,res) =>{
   fs.readFile('boat.png',function (e, data) {
      res.send(data);
   })
});

//------------------JS Routes-----------------------------------------
app.get('/vues.js', (req,res) =>{
   fs.readFile('vues.js',function (e, data) {
      res.send(data);
   })
});
