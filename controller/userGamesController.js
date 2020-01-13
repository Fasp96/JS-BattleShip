var UsersGame = require("../models/UsersGames");

function insertUserGame(user_id, game_id, callback){
    UsersGame.insertUserGame(user_id, game_id, callback);
}

function getAllUserGames(user_id,callback){
    UsersGame.getAllUserGames(user_id,callback)
}

module.exports = {

    insertUserGame,
    getAllUserGames
};