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
      console.log('data:', JSON.stringify(data));
      console.log('Message received :', data.message);
      console.log('Message from game :', data.game_id);
      console.log('Message is from :', data.user_id);

      io.sockets.emit('new game message',
         {message: data.message, game_id: data.game_id, user_id: data.user_id });
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

      res.render('board', req.params);
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
   userController.verifyEmail(req.body.user_email,function(result){
      if(result!="Error getting user"){
         console.log(' There is already an account with this email');

         res.redirect('/register');


      }else{
         userController.insertUser(req.body.user_email,req.body.user_password,function(result){
            console.log("result: "+result);
            if(result!="Error getting user"){
               sess = req.session;
               sess.user = result;
               res.redirect('/');
            }else{
               res.redirect('/register');
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


   app.get('/newGame2', (req, res) => {
      if(sess) {
         gamesController.insertGame(sess.user._id,function(result){
            console.log("result: "+result);
            if(result!="Error inserting game"){
               sess.game = result;
   
               res.redirect("game="+sess.game._id+">&&user="+sess.user._id);
   
               //res.render('gameOptions1', {sess: sess})
   
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
   if(sess) {
      gamesController.getAllGames(sess.user._id,function(result){
         console.log(result.length);
         res.render('gameContinue1',{games:result ,sess: sess});
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
      if(sess) {
         gamesController.getAllGames(sess.user._id,function(result){
            console.log(result.length);
            res.render('gameContinue2',{games:result ,sess: sess});
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

app.get('/battleship1H.png', (req,res) =>{
   fs.readFile('ships/battleship(1)H.png',function (e, data) {
      res.send(data);
   })
});
app.get('/battleship2H.png', (req,res) =>{
   fs.readFile('ships/battleship(2)H.png',function (e, data) {
      res.send(data);
   })
});
app.get('/battleship3H.png', (req,res) =>{
   fs.readFile('ships/battleship(3)H.png',function (e, data) {
      res.send(data);
   })
});
app.get('/battleship4H.png', (req,res) =>{
   fs.readFile('ships/battleship(4)H.png',function (e, data) {
      res.send(data);
   })
});

app.get('/carrier1H.png', (req,res) =>{
   fs.readFile('ships/carrier(1)H.png',function (e, data) {
      res.send(data);
   })
});
app.get('/carrier2H.png', (req,res) =>{
   fs.readFile('ships/carrier(2)H.png',function (e, data) {
      res.send(data);
   })
});
app.get('/carrier3H.png', (req,res) =>{
   fs.readFile('ships/carrier(3)H.png',function (e, data) {
      res.send(data);
   })
});
app.get('/carrier4H.png', (req,res) =>{
   fs.readFile('ships/carrier(4)H.png',function (e, data) {
      res.send(data);
   })
});
app.get('/carrier5H.png', (req,res) =>{
   fs.readFile('ships/carrier(5)H.png',function (e, data) {
      res.send(data);
   })
});

app.get('/cruiser1H.png', (req,res) =>{
   fs.readFile('ships/cruiser(1)H.png',function (e, data) {
      res.send(data);
   })
});
app.get('/cruiser2H.png', (req,res) =>{
   fs.readFile('ships/cruiser(2)H.png',function (e, data) {
      res.send(data);
   })
});
app.get('/cruiser3H.png', (req,res) =>{
   fs.readFile('ships/cruiser(3)H.png',function (e, data) {
      res.send(data);
   })
});

app.get('/destroyer1H.png', (req,res) =>{
   fs.readFile('ships/destroyer(1)H.png',function (e, data) {
      res.send(data);
   })
});
app.get('/destroyer2H.png', (req,res) =>{
   fs.readFile('ships/destroyer(2)H.png',function (e, data) {
      res.send(data);
   })
});

app.get('/submarine1H.png', (req,res) =>{
   fs.readFile('ships/submarine(1)H.png',function (e, data) {
      res.send(data);
   })
});
app.get('/submarine2H.png', (req,res) =>{
   fs.readFile('ships/submarine(2)H.png',function (e, data) {
      res.send(data);
   })
});
app.get('/submarine3H.png', (req,res) =>{
   fs.readFile('ships/submarine(3)H.png',function (e, data) {
      res.send(data);
   })
});

app.get('/battleship1V.png', (req,res) =>{
   fs.readFile('ships/battleship(1)V.png',function (e, data) {
      res.send(data);
   })
});
app.get('/battleship2V.png', (req,res) =>{
   fs.readFile('ships/battleship(2)V.png',function (e, data) {
      res.send(data);
   })
});
app.get('/battleship3V.png', (req,res) =>{
   fs.readFile('ships/battleship(3)V.png',function (e, data) {
      res.send(data);
   })
});
app.get('/battleship4V.png', (req,res) =>{
   fs.readFile('ships/battleship(4)V.png',function (e, data) {
      res.send(data);
   })
});

app.get('/carrier1V.png', (req,res) =>{
   fs.readFile('ships/carrier(1)V.png',function (e, data) {
      res.send(data);
   })
});
app.get('/carrier2V.png', (req,res) =>{
   fs.readFile('ships/carrier(2)V.png',function (e, data) {
      res.send(data);
   })
});
app.get('/carrier3V.png', (req,res) =>{
   fs.readFile('ships/carrier(3)V.png',function (e, data) {
      res.send(data);
   })
});
app.get('/carrier4V.png', (req,res) =>{
   fs.readFile('ships/carrier(4)V.png',function (e, data) {
      res.send(data);
   })
});
app.get('/carrier5V.png', (req,res) =>{
   fs.readFile('ships/carrier(5)V.png',function (e, data) {
      res.send(data);
   })
});

app.get('/cruiser1V.png', (req,res) =>{
   fs.readFile('ships/cruiser(1)V.png',function (e, data) {
      res.send(data);
   })
});
app.get('/cruiser2V.png', (req,res) =>{
   fs.readFile('ships/cruiser(2)V.png',function (e, data) {
      res.send(data);
   })
});
app.get('/cruiser3V.png', (req,res) =>{
   fs.readFile('ships/cruiser(3)V.png',function (e, data) {
      res.send(data);
   })
});

app.get('/destroyer1V.png', (req,res) =>{
   fs.readFile('ships/destroyer(1)V.png',function (e, data) {
      res.send(data);
   })
});
app.get('/destroyer2V.png', (req,res) =>{
   fs.readFile('ships/destroyer(2)V.png',function (e, data) {
      res.send(data);
   })
});

app.get('/submarine1V.png', (req,res) =>{
   fs.readFile('ships/submarine(1)V.png',function (e, data) {
      res.send(data);
   })
});
app.get('/submarine2V.png', (req,res) =>{
   fs.readFile('ships/submarine(2)V.png',function (e, data) {
      res.send(data);
   })
});
app.get('/submarine3v.png', (req,res) =>{
   fs.readFile('ships/submarine(3)V.png',function (e, data) {
      res.send(data);
   })
});
//------------------JS Routes-----------------------------------------
app.get('/vues.js', (req,res) =>{
   fs.readFile('vues.js',function (e, data) {
      res.send(data);
   })
});
