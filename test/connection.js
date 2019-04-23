const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

before(function(done)
{
    mongoose.connect(
        'mongodb://localhost:27017/myapp',
        {
            useNewUrlParser: true
        });

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


//disconnect probably
