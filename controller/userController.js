var User = require("../models/User");

function getUsers(callback){
    //tratar dados, filtrar, mais queries,...
    User.getUsers(callback);
}

function insertUser(user,callback){
    note.insertUsers(user.email, user.password,callback);
}

module.exports = {
    getUsers,
    insertUser
};