var mongoConfig = require('../mongoConfig');
var ObjectId = require('mongodb').ObjectID;

function insertUser(name, email,password,callback){
    var db = mongoConfig.getDB();
    var line = {name:name, email:email, password:password, num_games:0, num_victories:0};
    db.collection("users").insertOne(line,function(err, res){
        if(err)
            callback("Error inserting user");
        else{
            console.log("res_op: "+JSON.stringify(res.ops[0]));
            callback(res.ops[0]);
        }
    });
}

function getUser(user_id,callback){
    var db = mongoConfig.getDB();
    const query = {_id: ObjectId(user_id)};
    console.log("query: "+query);
    console.log("query: "+JSON.stringify(query));
    db.collection('users').findOne(query, function(err,result){
        console.log("getUser_result: "+JSON.stringify(result));
        if (err) throw err;
        if(result){
            callback(result);
        }else{
            callback("Error getting game");
        }
    });
}

function addGame(user_id ,callback){
    var db = mongoConfig.getDB();
    getUser(user_id,function(result){
        if(result){
            const query1 = {_id: ObjectId(user_id)};
            const query2 = {name: result.name, email: result.email, password: result.password, 
                                num_games: (result.num_games+1), num_victories: result.num_victories};
            db.collection('users').update(query1, query2, function(err, result) {
                if (err) throw err;
                if(result){
                    callback(result);
                }else{
                    callback("Error updating user number of games");
                }
            });       
        } 
    });
}

function addVictory(user_id ,callback){
    var db = mongoConfig.getDB();
    getUser(user_id,function(result){
        if(result){
            const query1 = {_id: ObjectId(user_id)};
            const query2 = {name: result.name, email: result.email, password: result.password, 
                                num_games: result.num_games, num_victories: (result.num_victories+1)};
            db.collection('users').update(query1, query2, function(err, result) {
                if (err) throw err;
                if(result){
                    callback(result);
                }else{
                    callback("Error updating user number of victories");
                }
            });       
        } 
    });
}

function getUsers(email,password,callback){
    var db = mongoConfig.getDB();
    const query = {email: email, password: password}
    db.collection("users").findOne(query, function(err, result) {
        if (err) throw err;
        if(result){
            callback(result);
        }else{
            callback("Error getting user");
        }
    });
}

function verifyName(name,callback){
    var db = mongoConfig.getDB();
    const query = {name: name}
    console.log("query: "+JSON.stringify(query));
    db.collection("users").findOne(query, function(err, result) {
        if (err) throw err;
        if(result){
            callback("Error name exists");
        }else{
            callback("No user with the same name");
        }
    });
}

function verifyEmail(email,callback){
    var db = mongoConfig.getDB();
    const query = {email: email}
    db.collection("users").findOne(query, function(err, result) {
        if (err) throw err;
        if(result){
            callback("Error email exists");
        }else{
            callback("No user with the same email");
        }
    });
}

module.exports = {
    getUsers,
    insertUser,
    verifyName,
    verifyEmail,
    addGame,
    addVictory
};