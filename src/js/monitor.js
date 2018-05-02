const signalhub = require('signalhub');
const hub = signalhub('step-conter', ['http://192.168.0.100:8080']);

hub.subscribe('teste').on('data', console.log);