const Nexmo = require('nexmo');
const nexmo = new Nexmo(
   {
      apiKey: '8594d495',
      apiSecret: 'uLbrKifJBpbgD65G'
   })

const from = '19048077729'
const to = '17074706980'
const text = 'Hello from Nexmo'

nexmo.message.sendSms(from, to, text);
