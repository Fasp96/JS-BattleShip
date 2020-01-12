var UsersGame = require("../models/UsersGames");

function insertUsersGames(user_id, game_id, callback){
    UsersGame.insertUsersGames(user_id, game_id, callback);
}

function getAllUsersGames(user_id,callback){
    UsersGame.getAllUsersGames(user_id,callback)
}

module.exports = {

    insertUsersGames,
    getAllUsersGames
};