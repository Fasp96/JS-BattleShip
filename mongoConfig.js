const mongo    =  require('mongodb');
var MongoClient = mongo.MongoClient;

var _db;

module.exports = {
    connectToServer :  function(callback){
        MongoClient.connect("mongodb://localhost:27017/",{ useUnifiedTopology: true },function(err,client){
        if(!err){
            if (err) throw err;
            _db = client.db("battle_ship");
            console.log("Connected to battle_ship database");
            return callback(err);
        }
     });
    }
    ,
    getDB: function(){
        return _db;
    }

};
