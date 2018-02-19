const mongo = require('mongodb').MongoClient;
const socketi = require('socket.io');
var express = require('express');

var port= process.env.PORT || 4200;
var app = express();
var server = app.listen(port,function(){
    console.log("listening...")
});
app.use(express.static('public'));

var client = socketi(server);
mongo.connect('mongodb://admin:admin@ds121238.mlab.com:21238/chatapp', function(err, db){/*mongodb://127.0.0.1:27017/chatapp*/
    if(err){
        throw err;
    }
    console.log('MongoDB connected!');

    client.on('connection',function(socket){
        console.log("Made connection socket!");
        let chat = db.collection('chats');
        let chatCol = db.collection('chatCol');
        let users = db.collection('users');
        sendStatus = function(s){
            socket.emit('status',s);
        }
        socket.on('newChat',function(data){
            let cname= data.cname;
            let key= data.key;
            if(cname == ''){
                sendStatus('Invalid data');
            }
            else{
                chatCol.insert({cname: cname, key: key},function(){
                    client.emit('chatNames',[data]);
                    sendStatus({
                        message:'Chat Added'
                    });
                });
            }
        });
        chat.find().limit(100).sort({_id:1}).toArray(function(err,res){
            if(err){
                throw err;
            }
            socket.emit('output',res);
        });
        chatCol.find().limit(100).sort({_id:1}).toArray(function(err,res){
            if(err){
                throw err;
            }
            socket.emit('chatNames',res);
        });

        socket.on('input', function(data){
            let name = data.name;
            let message = data.message;

            if(name == '' || message == ''){
                sendStatus('Please enter a name and a message!');
            }
            else{
                chat.insert({name: name, message:message},function(){
                    client.emit('output',[data]);

                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    });
                });
            }
        });
        socket.on('vInput', function(data){
            let varc = db.collection(data.chatname);
            let name = data.name;
            let message = data.message;

            if(name == '' || message == ''){
                sendStatus('Please enter a name and a message!');
            }
            else{
                varc.insert({name: name, message:message},function(){
                    client.emit('vChat-mes',[data]);

                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    });
                });
            }
        });
        socket.on('register',function(data){
            users.insert({uname: data.rname, password:data.rpass});
        });
        socket.on('login',function(data){
            users.find().toArray(function(err,res){
                if(err){
                    throw err;
                }
                socket.emit('verify-user', res);
            });
        });
        socket.on('typing',function(data){
            socket.broadcast.emit('typing',data);
        });
        socket.on('chat-room',function(data){
            chatCol.find().toArray(function(err,res){
                if(err){
                    throw err;
                }
                socket.emit('chat-names1', res);
            });
        });
        socket.on('newChat-room',function(data){
            let varc = db.collection(data);
            varc.find().limit(100).sort({_id:1}).toArray(function(err,res){
                if(err){
                    throw err;
                }
                socket.emit('vChat-mes',res);
            });
        });
        socket.on('clear',function(data){
            chatCol.remove();
            chat.remove({},function(){
                socket.emit('cleared');
            });
        });
    });
    
});

