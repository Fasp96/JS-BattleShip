var mongoUtil = require('../mongoConfig');

function insertUser(c,t,callback){
    var line = {email:c, password:t};
    mongoUtil.getDriver().collection('users').insertOne(line,function(err,res){
        if(err)
            callback("Error inserting user");
        else{
            callback("user inserted");
        }
    });
}

function insertUser(c,t,callback){
    var db = mongoUtil.getDB();
    var line = {email:c, password:t};
    //console.log(line);
    db.collection("users").insertOne(line, function(err, res) {
        if(err)
            callback("Error inserting note")
        else
            callback("user inserted");
    });
}

function getUsers(callback){
    mongoUtil.getDriver().collection('users').find().toArray(function(err, result){
        if(err) throw err;
        console.log(result);
        callback(result);
    })
}

module.exports = {
    getUsers,
    insertUser
};