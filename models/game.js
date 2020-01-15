var mongoConfig = require('../mongoConfig');


function insertGame(user_id,callback){
    var db = mongoConfig.getDB();
    var line = {users:[user_id], type: "1v1",
        ships:[
        [{x:"", y:"", orientation:"", type:"Carrier", size:"5", hits:"0"}, 
        {x:"", y:"", orientation:"", type:"Battleship", size:"4", hits:"0"}, 
        {x:"", y:"", orientation:"", type:"Cruiser", size:"3", hits:"0"},
        {x:"", y:"", orientation:"", type:"Submarine", size:"3", hits:"0"},
        {x:"", y:"", orientation:"", type:"Destroyer", size:"2", hits:"0"}
    ]], 
        shoots:[[]], 
        user_turn_id: user_id,
        winner_id: ""};
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
    query = {"users.0": {"$ne": user_id},"users.1":0};
    db.collection('games').find(query).toArray(function(err,result){
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
    db.collection("games").updateOne({_id:game_id},{$set:{"users.1":+user_id}}, function(err, result) {
        if (err) throw err;
        if(result){
            callback(result);
        }else{
            callback("Error getting game");
        }
    });
}

function updateShoots(shoot_positions,game_id,user_id,callback){
    var db = mongoConfig.getDB();

    const query = {_id: game_id,users:[user_id]}
    db.collection("games").findOne(query, function(err, result) {
        if (err) throw err;
        if(result){
            //se encontrar significa que a jogada é do P2
            const query1={_id:game_id};
            console.log("query1: "+JSON.stringify(query1));
            const query2={$push:{"shoots.2":+shoot_positions}};
            console.log("query: "+query1,query2);
            db.collection("games").updateOne({_id:game_id},{$push:{"shoots.2":+(shoot_positions)}},function(err,result) {
                if (err) throw err;
                if(result){
                    callback(result);
                }else{
                    callback("Error getting game");
                }
            });
        }else{
            //Se não encontrar significa que a jogada é do P1
            const query3={_id:game_id};
            console.log("query3: "+JSON.stringify(query3));
            const query4={$push:{"shoots.1":+shoot_positions}};
            console.log("query: "+query3,query4);
            db.collection("games").updateOne({_id:game_id},{$push:{"shoots.1":+(shoot_positions)}},function(err,result) {
                if (err) throw err;
                if(result){
                    callback(result);
                }else{
                    callback("Error getting game");
                }
            });
        }
    });
}

function getGameId(game_id,callback){
    var db = mongoConfig.getDB();
    //var line = {email: { $exists: true }, password: { $exists: true }};
    const query = {id: game_id};
    console.log("query: "+query);
    console.log("query: "+JSON.stringify(query));
    db.collection('games').find(query).toArray(function(err,result){
        if(!err)
            callback(result);
    });
}

module.exports = {
    updateGame,
    insertGame,
    getAllGames,
    getGameId,
    updateShoots
};