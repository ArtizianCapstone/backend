var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

module.exports = function() {
    this.addArtisanText = function(myDoc, result) {
        console.log("attempting to send sms message...");
        var messageParams =
        {
           Message: "You have been added to an artisan group created by " + myDoc.name,
           PhoneNumber: '+' + result.phone_number
        };

        var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(messageParams).promise();

        publishTextPromise.then(
           function(data)
           {
              console.log("MessageID is " + data.MessageID);
           })
           .catch(
              function(err)
              {
                 console.error(err, err.stack);
              });

    }

    this.testSmsFramework = function( arg ) { return "successful function call with arg: " + arg }
}
