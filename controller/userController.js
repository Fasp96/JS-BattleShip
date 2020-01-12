var User = require("../models/user");

function getUsers(email, password,callback){
    //tratar dados, filtrar, mais queries,...
    User.getUsers(email, password,callback);
}

function verifyEmail(email,callback){
    //tratar dados, filtrar, mais queries,...
    User.verifyEmail(email,callback);
}

function insertUser(email, password, callback){
    User.insertUser(email, password, callback);
}

module.exports = {
    getUsers,
    insertUser,
    verifyEmail
};