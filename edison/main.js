var mraa   = require('mraa'); //require mraa
var socket = require('socket.io-client');
//var LCD    = require ('jsupm_i2clcd');

var serverIP = "http://192.168.2.2:3700";
var io = socket(serverIP);

var portRelay   = [5];
var relays      = [];
var portButtons = [2];
var buttons = [];

var applianceName = ["TV"];

var processingRequest = false;
var delay = 100;


var light = new mraa.Aio(0);
//var myLCD = new LCD.Jhd1313m1(6, 0x3E, 0x62);


for(i=0;i<portRelay.length;i++){
    relays.push(new mraa.Gpio(portRelay[i]));
    relays[i].dir(mraa.DIR_OUT);
}

for(i=0;i<portButtons.length;i++){
    buttons.push(new mraa.Gpio(portButtons[i]));
    buttons[i].dir(mraa.DIR_IN);
}



var watchButton = setInterval(periodicActivity,delay);


function periodicActivity() //
{
    for(i=0;i<buttons.length;i++){
        var res = buttons[i].read();
        if(res>0 && !processingRequest){
          processingRequest = true;
          clearInterval(watchButton);
          askPermission(i);
        }
    }
}

io.on("on", function(msg) {
    toogleRelay(msg["button"], true);
});

io.on("off", function(msg) {
  toogleRelay(msg["button"], false);
});

function askPermission(button){
    console.log("Button pressed: "+button);
    //msgToUser(button);
    io.emit("request",{status:button});
    processingRequest = false;
    watchButton = setInterval(periodicActivity,delay);

}

function toogleRelay(button, onOff){
  if(onOff){
    relays[button].write(1);
  }else{
    relays[button].write(0);
  }
}

function msgToUser(button){
  lcdMessage = "Turn on the "+applianceName[button];
  myLCD.setCursor(0,0);
  myLCD.write(lcdMessage);
  //myLCD.setCursor(1,0);
  //myLCD.write(lcdMessage.substring(16,16));
  setTimeout(function(){
    myLCD.clear();
  },5000)
}




