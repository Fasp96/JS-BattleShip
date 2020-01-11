var express = require('express');
const app = express();
var path = require('path');
var bodyParser = require('body-parser');
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
app.get('/', function(req,res){
   res.render("index");
});

app.get('/menu', (req, res) => {
   res.render('menu');
});

app.get('/board', (req, res) => {
   res.render('board');
});
app.get('/game=:game_ID&&user=:user_id', (req, res) => {
   res.render('board', req.params);
});

app.get('/login', (req, res) => {
   res.render('login_form');
});
app.post('/login', function(req, res){
   userController.getUsers(req.body.user_email,req.body.user_password,function(result){
      console.log("result: "+result);
      if(result!="Error getting user"){
         res.render('menu', { user: result });
      }else{
         res.render('index')
      }
   });
});

app.get('/register', (req, res) => {
   res.render('register_form');
});
app.post('/register', function(req,res){
   userController.insertUser(req.body.user_email,req.body.user_password,function(result){
      console.log("result: "+result);
      if(result!="Error getting user"){
         res.render('menu', { user: result });
      }else{
         res.render('index')
      }
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



