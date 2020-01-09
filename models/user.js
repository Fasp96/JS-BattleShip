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