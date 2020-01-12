var mongoConfig = require('../mongoConfig');


function insertGame(user_id,callback){
    var db = mongoConfig.getDB();
    var line = {users:[user_id], ships:[5,5], shoots:[0,0], vencedor_id:0};
    db.collection("games").insertOne(line,function(err, res){
        if(err)
            callback("Error inserting game");
        else{
            console.log("res_op: "+JSON.stringify(res.ops[0]));
            callback(res.ops[0]);
        }
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

module.exports = {
    getGame,
    insertGame
};