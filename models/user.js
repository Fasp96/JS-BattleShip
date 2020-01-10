var mongoCongig = require('../mongoConfig');

function insertUser(c,t,callback){
    var db = mongoCongig.getDB();
    var line = {email:c, password:t};
    db.collection("users").insertOne(line,function(err, res){
        if(err)
            callback("Error inserting user");
        else{
            callback("user inserted");
        }
    });
}


function getUsers(c,t,callback){
    var db = mongoConfig.getDB();
    var line = {email: { $exists: true }, password: { $exists: true }};
    var cursor = db.collection('users').findOne(line,function(err,res){

        if(err)
        callback("Error to login");
        else{
        callback("user login");
        }
    });
}


module.exports = {
    getUsers,
    insertUser
};