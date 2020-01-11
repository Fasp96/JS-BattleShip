var mongoConfig = require('../mongoConfig');

function insertUser(email,password,callback){
    var db = mongoConfig.getDB();
    var line = {email:email, password:password};
    db.collection("users").insertOne(line,function(err, res){
        if(err)
            callback("Error inserting user");
        else{
            console.log("res_op: "+JSON.stringify(res.ops[0]));
            callback(res.ops[0]);
        }
    });
}

function getUsers(c,t,callback){
    var db = mongoConfig.getDB();
    //var line = {email: { $exists: true }, password: { $exists: true }};
    const query = {email: c, password: t}
    console.log("query: "+query);
    console.log("query: "+JSON.stringify(query));
    const user = db.collection("users").findOne(query, function(err, result) {
        if (err) throw err;
        if(result){
            callback(result);
        }else{
            callback("Error getting user");
        }
    });
}

module.exports = {
    getUsers,
    insertUser
};