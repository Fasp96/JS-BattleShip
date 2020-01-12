var mongoConfig = require('../mongoConfig');


function insertGame(user_id,callback){
    var db = mongoConfig.getDB();
    var line = {users:[user_id,0], ships:[5,5], shoots:[0,0], vencedor_id:0};
    db.collection("games").insertOne(line,function(err, res){
        if(err)
            callback("Error inserting game");
        else{
            console.log("res_op: "+JSON.stringify(res.ops[0]));
            callback(res.ops[0]);
        }
    });
}

function getAllGames(user_id,callback){
    var db = mongoConfig.getDB();
    //console.log(db);
    
    query = {"users.0": {"$ne": user_id},"users.1":0};
    var cursor = db.collection('games').find(query).toArray(function(err,result){
        if(!err)
            callback(result);
    });
}


function getGame(c,callback){
    var db = mongoConfig.getDB();
    //var line = {email: { $exists: true }, password: { $exists: true }};
    const query = {users: [c]}
    console.log("query: "+query);
    console.log("query: "+JSON.stringify(query));
    const user = db.collection("games").findOne(query, function(err, result) {
        if (err) throw err;
        if(result){
            callback(result);
        }else{
            callback("Error getting user");
        }
    });
}

function getGameId(game_id,callback){
    var db = mongoConfig.getDB();
    //var line = {email: { $exists: true }, password: { $exists: true }};
    const query = {_id:game_id}
    console.log("query: "+query);
    console.log("query: "+JSON.stringify(query));
    const user = db.collection("games").findOne(query, function(err, result) {
        if (err) throw err;
        if(result){
            callback(result);
        }else{
            callback("Error getting user");
        }
    });
}

module.exports = {
    getGame,
    insertGame,
    getAllGames,
    getGameId
};