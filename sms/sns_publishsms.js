var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

var params =
{
   Message: "Still works",
   PhoneNumber: '+17074706980'
};

//+13109088013
//+17074706980

var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

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
