const http = require('http');
const app = require('./app');
const publicIp = require( 'public-ip');

const port = process.env.Port || 3000
const server = http.createServer(app);

const myIp = "0.0.0.0";
/*
publicIp.v4().then(ip => {
    myIp = ip;
    console.log("your public ip address", ip );
});*/

server.listen(port, myIp);/*, myIp , function() {
    console.log('Listening to port:  ' + port );
});*/
