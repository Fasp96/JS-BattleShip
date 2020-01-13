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



module.exports = {
    getUsers,
    insertUser,
    verifyName,
    verifyEmail
};