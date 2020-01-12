var Game = require("../models/game");

function insertGame(user_id, callback){
    Game.insertGame(user_id, callback);
}


function getGame(user_id, callback){
    Game.getGame(user_id, callback);
}

function getAllGames(user_id,callback){
    Game.getAllGames(user_id,callback);
}
function getGameId(game_id,callback){
    Game.getGameId(game_id,callback);
}


module.exports = {
    getGame,
    insertGame,
    getAllGames,
    getGameId
};