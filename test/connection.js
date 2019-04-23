const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

before(function(done)
{
    /*
    mongoose.connect(
        'mongodb://jkurtz678:'+
        process.env.MONGO_ATLAS_PW + 
        '@artizian-shard-00-00-kdklx.mongodb.net:27017,artizian-shard-00-01-kdklx.mongodb.net:27017,artizian-shard-00-02-kdklx.mongodb.net:27017/test?ssl=true&replicaSet=Artizian-shard-0&authSource=admin&retryWrites=true',
        {
            useNewUrlParser: true
        });
    */

    mongoose.connection.once('open', function()
    {
        console.log("Connection made");
        done();
    })
        .on('error', function(error)
        {
            console.log("Connection error", error);
        });
});
