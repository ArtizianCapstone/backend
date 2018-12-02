//imports
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

var params =
{
   attributes:
   [
      'DefaultSMSType'
   ]
};

var getSMSTypePromise = new AWS.SNS({apiVersion: '2010-03-31'}).getSMSAttributes(params).promise();

getSMSTypePromise.then(
   function(data)
   {
      console.log(data);
   })
   .catch(
      function(err)
      {
         console.error(err, err.stack);
      });
