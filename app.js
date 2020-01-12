var express = require('express');
const app = express();

var session = require('express-session');
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
app.use(session({secret: 'total secret', saveUninitialized: true}));
app.use(bodyParser.json());

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
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
   //Messages received from chat
   socket.on('sending message', function(data) {
      io.sockets.emit('new game message',
         {message: data.message, game_id: data.game_id, user_id: data.user_id , user_name: data.user_name});
   });

   //Shot message
   socket.on('shoot player', function(data) {
      io.sockets.emit('recieve shot',
         {shoot_y: data.shoot_y, shoot_x: data.shoot_x , game_id: data.game_id, user_id: data.user_id , user_name: data.user_name});
   });

   //Shot response
   socket.on('shot hitted', function(data) {
      io.sockets.emit('hit',
         {shoot_y: data.shoot_y, shoot_x: data.shoot_x , game_id: data.game_id, user_id: data.user_id});
   });
   socket.on('shot missed', function(data) {
      io.sockets.emit('miss',
         {shoot_y: data.shoot_y, shoot_x: data.shoot_x , game_id: data.game_id, user_id: data.user_id});
   });
});

//MongoDB
mongoUtil.connectToServer(function(err){
   app.listen(8888,function(){
       console.log("listening on 8888");
   });
})

//-----------------------Views Routes-----------------------------------------
var alert;


//Initial Route
app.get('/', function(req,res){
   sess = req.session;
   if(sess.user) {
      res.render('menu', {sess: sess.user});
   }else{
      res.render('index');
   }
});


//GameBoard Routes
app.get('/board', (req, res) => {
   res.render('board');
});
app.get('/game=:game_id&&user=:user_id', (req, res) => {
   sess = req.session;
   //Deixar os comentarios!!! (Necessario para correr testes com varios utilizadores)
   //if(sess.user._id == req.params.user_id){
      var data = req.params;
      data.sess = sess.user;
      console.log("data: "+JSON.stringify(data));
      res.render('board', data);
   //}else{
   //  res.redirect('/');
   //}
});

//Login Routes
app.get('/login', (req, res) => {
   sess = req.session;
   if(sess.user) {
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
   sess = req.session;
   if(sess.user) {
      res.redirect('/');
   }else{
      res.render('register_form', {alert: alert});
      alert = "";
   }
});
app.post('/register', function(req,res){
   userController.verifyName(req.body.user_name,function(result){
      if(result=="Error name exists"){
         console.log('There is already an account with this name');
         alert = "There is already an account with this name";
         res.redirect('/register');
      }else{
         userController.verifyEmail(req.body.user_email,function(result){
            if(result=="Error email exists"){
               console.log('There is already an account with this email');
               alert = "There is already an account with this email";
               res.redirect('/register');
            }else{
               userController.insertUser(req.body.user_name, req.body.user_email,req.body.user_password,function(result){
                  console.log("result: "+result);
                  if(result=="Error inserting user"){
                     alert = "Error inserting user";
                     res.redirect('/register');
                  }else{
                     sess = req.session;
                     sess.user = result;
                     alert = "";
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
      if(err) {
         return console.log(err);
      }
      res.redirect('/');
   });
});

//Game Options Routes
app.get('/gameOptions1', (req, res) => {
   sess = req.session;
   if(sess.user) {

         res.render('gameOptions1', {sess: sess.user})

      } else{
         res.render('index');
      }
   });

app.get('/gameOptions2', (req, res) => {
   sess = req.session;
   if(sess.user) {
      res.render('gameOptions2', {sess: sess.user})
   }else{
      res.render('index');
   }
});



//new Game Route

app.get('/newGame', (req, res) => {
   sess = req.session;
   if(sess.user) {
      gamesController.insertGame(sess.user._id,function(result){
         console.log("result: "+result);
         if(result!="Error inserting game"){
            sess.game = result;

            res.redirect("game="+sess.game._id+">&&user="+sess.user._id);

            //res.render('gameOptions1', {sess: sess.user})

         }else{

         location.href = "/gameOptions1";
         }
      });
      } else{
         res.render('index');
      }
   });


   app.get('/newGame2', (req, res) => {
      sess = req.session;
      if(sess.user) {
         gamesController.insertGame(sess.user._id,function(result){
            console.log("result: "+result);
            if(result!="Error inserting game"){
               sess.game = result;
   
               res.redirect("game="+sess.game._id+">&&user="+sess.user._id);
   
               //res.render('gameOptions1', {sess: sess.user})
   
            }else{
   
            location.href = "/gameOptions2";
            }
         });
         } else{
            res.render('index');
         }
      });
//continue Game Route

app.get('/continueGame', (req, res) => {
   sess = req.session;
   if(sess.user) {
      gamesController.getAllGames(sess.user._id,function(result){
         console.log(result.length);
         res.render('gameContinue1',{games:result ,sess: sess.user});
     }); 

      

      /*gamesController.getGame(sess.user._id,function(result){
         console.log("result: "+result);
         if(result!="Error inserting game"){
            sess.game = result;

            res.redirect("game="+sess.game._id+">&&user="+sess.user._id);

            //res.render('gameOptions1', {sess: sess})
        
         }else{

         location.href = "/gameOptions1";
         }
      });*/
      
      } else{
         res.render('index');
      }
   });


   app.get('/continueGame2', (req, res) => {
      sess = req.session;
      if(sess.user) {
         gamesController.getAllGames(sess.user._id,function(result){
            console.log(result.length);
            res.render('gameContinue2',{games:result ,sess: sess.user});
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
