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

//import express from 'express';
//import path from 'path';
//import bodyParser from 'body-parser';

app.use(urlParser);
app.set('view engine','ejs');
app.set("views", __dirname + '/views');
app.use(session({secret: 'total secret', saveUninitialized: true}));
app.use(bodyParser.json());
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

const gamesController = require('./controller/gamesController');
const userController = require('./controller/userController');
const userGamesController = require('./controller/userGamesController');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const PORT = 3000;
server.listen(PORT);
console.log('Server is running');

//Sockets
const connections = [];
var onePlayer_games = {};
var twoPlayers_games = {};
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
   //When player joins a 1v1 game
   socket.on('entered onePlayer game', function(data) {
      var game_id = data.game_id;
      if(!(game_id in onePlayer_games)){
         onePlayer_games[game_id] = 1;
         console.log("onePlayer_games: "+JSON.stringify(onePlayer_games));
      }else{
         onePlayer_games[game_id] += 1;
         console.log("onePlayer_games12: "+JSON.stringify(onePlayer_games));
         io.sockets.emit('not your turn',
            {game_id: game_id, user_id: data.user_id, user_name: data.user_name});
      }
      io.sockets.emit('new player message',
         {game_id: game_id, user_name: data.user_name});
   });
   //When player leaves a 1v1 game
   socket.on('left onePlayer game', function(data) {
      var game_id = data.game_id;
      console.log(data);
      onePlayer_games[game_id] -= 1;
      if(onePlayer_games[game_id]<=0){
         delete onePlayer_games[game_id];
      }
      console.log("onePlayer_games123: "+JSON.stringify(onePlayer_games));
   });

   //When player Lost a game

 socket.on('YOU LOST', function(data) {
   
      var name = data.user_name;
      console.log("Lost: "+name);

      io.sockets.emit('YOU WIN',
      {game_id: data.game_id, user_id: data.user_id, user_name: data.user_name});
});
   
   //When player is ready
   socket.on('I am ready', function(data) {
      io.sockets.emit('opponent is ready',
         {game_id: data.game_id, user_id: data.user_id, user_name: data.user_name});
   });
   //When player joins a 2v2 game
   socket.on('entered twoPlayers game', function(data) {
      var game_id = data.game_id;
      if(!(game_id in twoPlayers_games)){
         twoPlayers_games[game_id] = 1;
         console.log("twoPlayers_games: "+JSON.stringify(twoPlayers_games));
      }else{
      twoPlayers_games[game_id] += 1;
         console.log("twoPlayers_games12: "+JSON.stringify(twoPlayers_games));
      }
   });
   //When player leaves a 2v2 game
   socket.on('left twoPlayers game', function(data) {
      var game_id = data.game_id;
      twoPlayers_games[game_id] -= 1;
      if(twoPlayers_games[game_id]<=0){
         delete twoPlayers_games[game_id];
      }
   });
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
   socket.on('shoot hitted', function(data) {
      //gamesController.updateShoots([data.shoot_x,data.shoot_y],data.game_id,data.user_id);

      //deverá guardar na base de dados
      io.sockets.emit('hit',
         {shoot_y: data.shoot_y, shoot_x: data.shoot_x , game_id: data.game_id, user_id: data.user_id});
   });
   socket.on('shoot missed', function(data) {
      //gamesController.updateShoots([data.shoot_x,data.shoot_y],data.game_id,data.user_id);

      //deverá guardar na base de dados
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
   if(sess.user._id == req.params.user_id){
      var data = req.params;
      data.sess = sess.user;
      console.log("data: "+JSON.stringify(data));
      res.render('board', data);
   }else{
     res.redirect('/');
   }
});

app.get("/game=:item_id", (req, res) => {
   sess = req.session;
   if(sess.user) {
      //Deve procurar o jogo com o id do url
      var game_id = "ObjectId('"+req.params.item_id+"')";
      var game_i1 = req.params.item_id;
      console.log(game_id);

      gamesController.updateGame(game_id,sess.user._id,function(result){
         if(result!="Error getting game"){
            console.log("updategae: "+result.length);
            res.redirect('/game='+game_i1+'&&user='+sess.user._id);
         }else{
            res.redirect('/game='+game_i1+'&&user='+sess.user._id);
            //fazer o update
            //res.render('board', req.params);
         }
      });
   } else{
      res.render('index');
   }
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
      console.log("login_result: "+JSON.stringify(result));
      if(result!="Error getting user"){
         sess = req.session;
         sess.user = result;
         console.log("login_sess2: "+JSON.stringify(sess));
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
      res.render('register_form', {alert: sess.alert});
      sess.alert = "";
   }
});
app.post('/register', function(req,res){
   sess = req.session;
   userController.verifyName(req.body.user_name,function(result){
      if(result=="Error name exists"){
         console.log('There is already an account with this name');
         sess.alert = "There is already an account with this name";
         res.redirect('/register');
      }else{
         userController.verifyEmail(req.body.user_email,function(result){
            if(result=="Error email exists"){
               console.log('There is already an account with this email');
               sess.alert = "There is already an account with this email";
               res.redirect('/register');
            }else{
               userController.insertUser(req.body.user_name, req.body.user_email,req.body.user_password,function(result){
                  console.log("result: "+result);
                  if(result=="Error inserting user"){
                     sess.alert = "Error inserting user";
                     res.redirect('/register');
                  }else{
                     sess.user = result;
                     sess.alert = "";
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
app.get('/onePlayer', (req, res) => {
   sess = req.session;
   if(sess.user) {
      res.render('onePlayer', {sess: sess.user})
   } else{
      res.redirect('/');
   }
});

app.get('/twoPlayers', (req, res) => {
   sess = req.session;
   if(sess.user) {
      res.render('twoPlayers', {sess: sess.user})
   }else{
      res.redirect('/');
   }
});

//new 1v1 game
app.get('/newGame', (req, res) => {
   sess = req.session;
   if(sess.user) {
      gamesController.insertGame(sess.user._id,function(result){
         console.log("result: "+result);
         if(result!="Error inserting game"){
            userGamesController.insertUserGame(sess.user._id, result._id,function(result2){
               console.log("result: "+result2);
               if(result2!="Error inserting game_users"){
                  sess.game = result2;
                  res.redirect("game="+sess.game._id+">&&user="+sess.user._id);
               }else{
                  res.redirect('/onePlayer');
               }
            });
         }else{
            res.redirect('/onePlayer');
         }
      });
   } else{
      res.redirect('/');
   }
});

//new 2v2 game
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
            location.href = "/twoPlayers";
         }
      });
   }else{
      res.redirect('/');
   }
});

//continue Game Route
app.get('/continueGame',(req, res) => {
   sess = req.session;
   if(sess.user){
      userGamesController. getAllUserGames(sess.user._id,function(result){
         if(result){
            console.log("continuegame_result: "+JSON.stringify(result));
            res.render('gameContinue1',{games:result , sess: sess.user});
         }else{
            res.redirect('/');
         }
      });
   }else{
      res.redirect('/');
   }
});

app.get('/continueGame2', (req, res) => {
   sess = req.session;
   if(sess.user) {
      gamesController.getAllGames(sess.user._id,function(result){
         console.log(result.length);
         res.render('gameContinue2',{games:result ,sess: sess.user});
      });
   }else{
      res.redirect('/');
   }
});
//Join Route
app.get('/join', (req, res) => {
   sess = req.session;
   if(sess.user) {
      //gamesController.getAllGames(sess.user._id,function(result){
         console.log("join_games: "+JSON.stringify(onePlayer_games));
         res.render('gameJoin1',{games: onePlayer_games ,sess: sess});
      //});
   }else{
      res.redirect('/');
   }
});


//----------------Images Routes---------------------------------------
app.get('/splash1.png', (req,res) =>{
   fs.readFile('splash/splash1.png',function (e, data) {
      res.send(data);
   })
});
app.get('/splash2.png', (req,res) =>{
   fs.readFile('splash/splash2.png',function (e, data) {
      res.send(data);
   })
});
app.get('/splash3.png', (req,res) =>{
   fs.readFile('splash/splash3.png',function (e, data) {
      res.send(data);
   })
});
app.get('/splash4.png', (req,res) =>{
   fs.readFile('splash/splash4.png',function (e, data) {
      res.send(data);
   })
});

app.get('/explosion1.png', (req,res) =>{
   fs.readFile('explosion/explosion1.png',function (e, data) {
      res.send(data);
   })
});
app.get('/explosion2.png', (req,res) =>{
   fs.readFile('explosion/explosion2.png',function (e, data) {
      res.send(data);
   })
});
app.get('/explosion3.png', (req,res) =>{
   fs.readFile('explosion/explosion3.png',function (e, data) {
      res.send(data);
   })
});
app.get('/explosion4.png', (req,res) =>{
   fs.readFile('explosion/explosion4.png',function (e, data) {
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
//----------------Images Routes---------------------------------------
app.get('/hit.mp3', (req,res) =>{
   fs.readFile('sounds/hit.mp3',function (e, data) {
      res.send(data);
   })
});
app.get('/miss.mp3', (req,res) =>{
   fs.readFile('sounds/miss.mp3',function (e, data) {
      res.send(data);
   })
});
//------------------JS Routes-----------------------------------------
app.get('/vues.js', (req,res) =>{
   fs.readFile('vues.js',function (e, data) {
      res.send(data);
   })
});
