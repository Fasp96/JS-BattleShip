var mongoConfig = require('../mongoConfig');

function insertUsersGames(user_id,game_id,callback){
    var db = mongoConfig.getDB();
    var line = {users_id: user_id, game_id: game_id};
    db.collection("users_games").insertOne(line,function(err, res){
        if(err)
            callback("Error inserting users_games");
        else{
            console.log("res_op: "+JSON.stringify(res.ops[0]));
            callback(res.ops[0]);
        }
    });
}

module.exports = {

    insertUsersGames
};