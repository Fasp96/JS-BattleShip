var User = require("../models/User");

function getUsers(callback){
    //tratar dados, filtrar, mais queries,...
    User.getUsers(callback);
}

function insertUser(email, password, callback){
    User.insertUser(email, password, callback);
}

module.exports = {
    getUsers,
    insertUser
};