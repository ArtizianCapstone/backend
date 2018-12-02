var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

var phonelistPromise = new AWS.SNS({apiVersion: '2010-03-31'}).listPhoneNumbersOptedOut({}).promise();

phonelistPromise.then(
   function(data)
   {
      console.log(data);
   })
   .catch(
      function(err)
      {
         console.err(err, err.stack);
      });
