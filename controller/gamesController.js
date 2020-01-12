var Game = require("../models/game");

function insertGame(user_id, callback){
    Game.insertGame(user_id, callback);
}


function getGame(user_id, callback){
    Game.getGame(user_id, callback);
}

function getAllGames(callback){
    Game.getAllGames(callback);
}


module.exports = {
    getGame,
    insertGame,
    getAllGames
};