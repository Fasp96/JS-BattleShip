var UsersGame = require("../models/UsersGames");

function insertUsersGames(user_id, game_id, callback){
    UsersGame.insertUsersGames(user_id, game_id, callback);
}


module.exports = {

    insertUsersGames
};