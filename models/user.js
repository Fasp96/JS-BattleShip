var mongoConfig = require('../mongoConfig');

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
    verifyEmail
};