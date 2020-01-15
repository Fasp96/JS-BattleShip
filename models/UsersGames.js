var mongoConfig = require('../mongoConfig');

function insertUserGame(user_id,game_id,callback){
    var db = mongoConfig.getDB();
    var line = {user_id: user_id, game_id: game_id};
    db.collection("users_games").insertOne(line,function(err, res){
        if(err)
            callback("Error inserting user_game");
        else{
            console.log("res_op: "+JSON.stringify(res.ops[0]));
            callback(res.ops[0]);
        }
    });
}

function getAllUserGames(user_id,callback){
    var db = mongoConfig.getDB();
    query = {user_id: user_id};
    db.collection('users_games').find(query).toArray(function(err,result){
        if(err)
            callback("Error finding user games");
        else{
            var games_left = [];
            var itemsProcessed = 1;
            result.forEach(function(game, index, array) {
                query = {_id: game.game_id, type: "1v1",winner_id: ""};
                db.collection('games').find(query).toArray(function(err,result1){
                    if(!err){
                        games_left.push((game));
                        if(itemsProcessed === array.length) {
                            callback(games_left);
                        }
                        itemsProcessed++;
                    }
                });
            });
        }
    });
}

function existUserGame(user_id, game_id,callback){
    var db = mongoConfig.getDB();
    var query = {user_id: user_id, game_id: game_id};
    db.collection("users_games").find(query,function(err, res){
        if(err)
            return false;
        else{
            return true;
        }
    });
}

module.exports = {
    insertUserGame,
    getAllUserGames,
    existUserGame
};