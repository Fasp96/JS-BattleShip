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


function updateGame(game_id,user_id,callback){
    var db = mongoConfig.getDB();
    //var line = {email: { $exists: true }, password: { $exists: true }};
    const query1={_id:game_id};
    console.log("query1: "+JSON.stringify(query1));
    const query2={$set:{"users.1":+user_id}};
    //const query2={$set:{"users.1:"+ user_id}};

    //const query = ({_id:game_id,$set:{"users.1:"user_id}});
    console.log("query: "+query1,query2);
    console.log("query: "+JSON.stringify(query));
    const user = db.collection("games").updateOne({_id:game_id},{$set:{"users.1":+user_id}}, function(err, result) {
        if (err) throw err;
        if(result){
            callback(result);
        }else{
            callback("Error getting game");
        }
    });
}

function getGameId(game_id,callback){
    var db = mongoConfig.getDB();
    //var line = {email: { $exists: true }, password: { $exists: true }};
    const query = {id: game_id};
    console.log("query: "+query);
    console.log("query: "+JSON.stringify(query));
    var cursor = db.collection('games').find(query).toArray(function(err,result){
        if(!err)
            callback(result);
    });
}

module.exports = {
    updateGame,
    insertGame,
    getAllGames,
    getGameId
};