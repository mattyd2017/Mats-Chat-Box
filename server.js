var express = require("express");
var http = require("http");

var app = express();
var server = http.Server(app);
var io = require("socket.io")(server);
var users = [];

/*
server.listen(3332, function(){
    console.log("Server address is port 3332.");
}); */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

app.get("/",function(req, res){
    res.sendFile(__dirname + "/index.html");
});
app.get("/styles/index.css",function(req, res){
    res.sendFile(__dirname + "/styles/index.css");
});
io.on("connection", function(socket){
   var name ="";
    socket.on("has connected", function(username){
           name = username;
           users.push(username); 
           io.emit("has connected",{username: username, userList: users});
    });

    socket.on("disconnect", function(){
       users.splice(users.indexOf(name), 1); 
       io.emit("has disconnected",{username: name, userList: users});
    });
    socket.on("new message", function(data){
        io.emit("new message", data);
    });
});
