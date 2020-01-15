var User = require("../models/user");

function getUsers(email, password, callback){
    //tratar dados, filtrar, mais queries,...
    User.getUsers(email, password, callback);
}

function insertUser(name, email, password, callback){
    User.insertUser(name, email, password, callback);
}

function verifyName(name,callback){
    //tratar dados, filtrar, mais queries,...
    User.verifyName(name,callback);
}

function verifyEmail(email,callback){
    //tratar dados, filtrar, mais queries,...
    User.verifyEmail(email,callback);
}

function addGame(user_id,callback){
    //tratar dados, filtrar, mais queries,...
    User.addGame(user_id,callback);
}

function addVictory(user_id,callback){
    //tratar dados, filtrar, mais queries,...
    User.addVictory(user_id,callback);
}


module.exports = {
    getUsers,
    insertUser,
    verifyName,
    verifyEmail,
    addGame,
    addVictory
};