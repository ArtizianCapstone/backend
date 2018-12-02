var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

var params =
{
   attributes:
   {
      'DefaultSMSType': 'Promotional'
   }
};

var setSMSTypePromise = new AWS.SNS({apiVersion: '2010-03-31'}).setSMSAttributes(params).promise();

setSMSTypePromise.then(
   function(data)
   {
      console.log(data);
   })
   .catch(
      function(err)
      {
         console.err(err, err.stack);
      });
