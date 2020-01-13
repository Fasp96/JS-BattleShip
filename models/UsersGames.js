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
            console.log("usersgames_result: "+JSON.stringify(result));
            var games_left = [];
            //result.forEach(function(game){
            var itemsProcessed = 1;
            result.forEach(function(game, index, array) {
                console.log("usersgames_game: "+JSON.stringify(game));
                query = {_id: game.game_id, type: "1v1",winner_id: ""};
                db.collection('games').find(query).toArray(function(err,result1){
                    if(!err){
                        console.log("usersgames_result1: "+JSON.stringify(result1));
                        games_left.push((game));
                        if(itemsProcessed === array.length) {
                            console.log("usersgames_found: "+JSON.stringify(games_left));
                            callback(games_left);
                        }
                        itemsProcessed++;
                    }
                });
            });
        }
    });
}

module.exports = {
    insertUserGame,
    getAllUserGames
};