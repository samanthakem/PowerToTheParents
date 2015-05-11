var express = require("express"); // importing the express library
var nodemailer = require('nodemailer');
var app = express(); // Initializing the express
var port = 3700; // setting the port

var devices = {};

app.get("/", function(req, res) {
    res.sendFile("index.html", {root: "."});
});
app.use(express.static('.'));

var io = require("socket.io").listen(app.listen(port));

io.on('connection', function(socket) {
/*  socket.on("log", function(msg){
        devices[socket.id] = {device: msg["device"], socket: socke, on: false};
        console.log("Device " + msg["device"] + " connected!");
    });
    */
    
    socket.on("yes", function(msg) {
        socket.broadcast.emit("on", {button: msg["button"]});
    });
    
    socket.on("no", function(msg) {
        socket.broadcast.emit("off", {button: msg["button"]});
    });
    
    socket.on("request", function(msg) {
        // This class is sent when I receive a request
        emailSender({name: "Samantha", surname: 'Monteiro', email: "samanthakem@gmail.com"}, "May I use the Hair Clipper?", "May their or not?", function(error, info){
            if(error){
                console.log(error);
            }
        });
    });
    
    /*
    socket.on('disconnect', function() {
        socket.emit("deviceDesconnected", device[socket.id]);
    }); */
});

function emailSender(to, subject, content, callback) {
    var user = "powertotheparenths@gmail.com";
    var pass = "789456power0";
    var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: user,
            pass: pass
        }
    });
    
    var mailOptions = {
        from: 'PowerToTheParents <'+user+'>',
        to: to['name'] + " <" + to['email'] + '>',
        subject: subject,
        html: "<a href='http://192.168.0.40:3700'>Authorize</a>"
    };

    transporter.sendMail(mailOptions, callback);
}