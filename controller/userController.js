var User = require("../models/User");

function getUsers(email, password,callback){
    //tratar dados, filtrar, mais queries,...
    User.getUsers(email, password,callback);
}

function insertUser(email, password, callback){
    User.insertUser(email, password, callback);
}

module.exports = {
    getUsers,
    insertUser
};