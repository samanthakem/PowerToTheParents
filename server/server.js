var express = require("express"); // importing the express library
var nodemailer = require('nodemailer');
var app = express(); // Initializing the express
var port = 3700; // setting the port

var devices = {};

var email = {
    to: {
        contact: {
            name: "Samantha",
            surname: 'Monteiro',
            email: "samanthakem@gmail.com"
        },
        content: {
            subject: "May I use the Hair Clipper?",
            body: "May their or not?"
        }
    },
    from: {
        user: "powertotheparenths@gmail.com",
        pass: "789456power0"
    }
}

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
        emailSender(email.to.contact, email.to.content.subject, email.to.content.body, function(error, info){
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
    var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: email.from.user,
            pass: email.from.pass
        }
    });
    
    var mailOptions = {
        from: 'PowerToTheParents <'+user+'>',
        to: to['name'] + " <" + to['email'] + '>',
        subject: subject,
        html: content + "<br><a href='http://192.168.2.2:3700'>Authorize</a>"
    };

    transporter.sendMail(mailOptions, callback);
}
