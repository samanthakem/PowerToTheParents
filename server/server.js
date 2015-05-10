var mraa = require('mraa'); // require mraa
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the Intel XDK console

var myOnboardLed = new mraa.Gpio(13);
myOnboardLed.dir(mraa.DIR_OUT);
var buttonEdison = new mraa.Gpio(2);
buttonEdison.dir(mraa.DIR_IN);

var express = require("express"); // importing the express library
var app = express(); // Initializing the express
var port = 3700; // setting the port

app.get("/", function(req, res) {
    res.sendFile("index.html", {root: "."});
});

var io = require("socket.io").listen(app.listen(port));

io.on('connection', function(socket) {
    console.log("User connected!");
    socket.broadcast.on("on", function(msg) {myOnboardLed.write(1); console.log(msg)});
    socket.broadcast.on("off", function(msg) {myOnboardLed.write(0); console.log(msg)});
    
    var buttonStateOld = buttonEdison.read();
    setInterval(function(){
        var buttonStateNew = buttonEdison.read();
        if (buttonStateOld != buttonStateNew && buttonStateNew == 1) {
            socket.emit("ask", {ask: "May I use the tv?"});
        }
        buttonStateOld = buttonStateNew;
    }, 10);
});