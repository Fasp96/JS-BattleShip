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

const userController = require('./controller/userController');
//import express from 'express';
//import path from 'path';
//import bodyParser from 'body-parser';

app.use(urlParser);
app.set('view engine','ejs');
app.set("views", __dirname + '/views');


//app.use(require('serve-static')(__dirname + '/../../public'));
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.json()); 

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const PORT = 3000;
server.listen(PORT);
console.log('Server is running');

const users = [];
const connections = [];

io.sockets.on('connection',(socket) => {
   connections.push(socket);
   console.log(' %s sockets is connected', connections.length);

   socket.on('disconnect', () => {
      connections.splice(connections.indexOf(socket), 1);
   });

   socket.on('sending message', (message) => {
      console.log('Message is received :', message);

      io.sockets.emit('new message', {message: message});
   });
});

mongoUtil.connectToServer(function(err){
   app.listen(8888,function(){
       console.log("listening on 8888");
   });
})

//Views Routes
var sess;

app.get('/', function(req,res){
   if(sess) {
      res.render('menu', {sess: sess});
   }else{
      res.render('index');
   }
});

app.get('/board', (req, res) => {
   res.render('board');
});

app.get('/game=:game_ID&&user=:user_id', (req, res) => {
   res.render('board', req.params);
});

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
         res.redirect('/');
      }
   });
});

app.get('/register', (req, res) => {
   if(sess) {
      res.redirect('/');
   }else{
      res.render('register_form');
   }
});
app.post('/register', function(req,res){
   userController.insertUser(req.body.user_email,req.body.user_password,function(result){
      console.log("result: "+result);
      if(result!="Error getting user"){
         sess = req.session;
         sess.user = result;
         res.redirect('/');
      }else{
         res.redirect('/');
      }
   });
});

app.get('/logout',(req,res) => {
   req.session.destroy((err) => {
      if(err) throw err;
      sess = null;
      res.redirect('/');
   });
});


//Images Routes
app.get('/miss.png', (req,res) =>{
   fs.readFile('miss.png',function (e, data) {
      res.send(data);   
   })
});


//JS Routes
app.get('/vues.js', (req,res) =>{
   fs.readFile('vues.js',function (e, data) {
      res.send(data);   
   })
});



