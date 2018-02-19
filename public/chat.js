/*------------------wallpaper change-------------------- */
(function(){
    var element = function(id){
        return document.getElementById(id);
    }
    var regLink=element('reg-link');
    var reg=element('registerBtn');
    var status = element('status');
    var messages = element('messages');
    var pmessage = element('pvmessages');
    var textarea = element('textarea');
    var textarea1 = element('textarea1');
    var username = element('username');
    var uname;
    var pword;
    var clearBtn = element('clear');
    var newBtn = element('new');
    var cnct = element('cnct');
    var chatn= element('chat-n');
    var cnames= element('chat-names');
    var chatName;
    var statusDefault = '';
    var cKey = element('cKey');
    var startBtn = element('start');
    var chatkey;
    var setStatus = function(s){
        status.textContent = s;

        if(s!==statusDefault){
            console.log('Message will dissapear!')
            var delay = setTimeout(function(){
                setStatus('');
            },4000);
        }
    }

    /*var socket = io.connect('https://stark-depths-16759.herokuapp.com');*/
    var socket = io.connect('http://localhost:4200'); 

    if(socket !== undefined){
        console.log('Connected to socket...');

        socket.on('output',function(data){
            console.log(data);
            if(data.length){
                for(var x = data.length-1; x >= 0;x--){
                    var message = document.createElement('div');
                    message.setAttribute('class','chat-message');
                    message.innerHTML = '<span class="name"">'+data[x].name +'</span>&nbsp&nbsp'+data[x].message;
                    messages.appendChild(message);
                    messages.insertBefore(message,messages.firstChild);
                }
            }
        });
        socket.on('vChat-mes',function(data){
            console.log(data);
            if(data.length){
                for(var x = data.length-1; x >= 0;x--){
                    var pessage = document.createElement('div');
                    pessage.setAttribute('class','chat-message');
                        pessage.innerHTML = '<span class="name">'+data[x].name +'</span>&nbsp&nbsp'+data[x].message;
                    pmessage.appendChild(pessage);
                    pmessage.insertBefore(pessage,pmessage.firstChild);
                }
            }
        });
        socket.on('status',function(data){
            setStatus((typeof data === 'object')? data.message:data);

            if(data.clear){
                textarea.value = '';
            }
        });
        regLink.addEventListener('click',function(event){
            event.preventDefault();
            document.getElementById('register-side').style.display="block";
            document.getElementById('login').style.display="none";
            document.getElementById('registerBtn').style.display="block";
            document.getElementById('start').style.display="none";
        });
        reg.addEventListener('click',function(){
            var regname=document.getElementById('regname').value;
            var regpword=document.getElementById('regpword').value;
            if(regname=="" || regpword==""){
                alert("invalid data");
            }
            else{
                socket.emit('register',{
                    rname:regname,
                    rpass:regpword
                });
                uname=regname;
                document.getElementById('namePopUp').style.display="none";
            }
        });
        textarea.addEventListener('keydown',function(event){
            if(event.which===13){
                socket.emit('input',{
                    chatname:chat,
                    name: uname,
                    message: textarea.value
                });
                event.preventDefault();
            }
            else{
                socket.emit('typing', username.value);
            }
        });
        textarea1.addEventListener('keydown',function(event){
            if(event.which===13){
                socket.emit('vInput',{
                    chatname:chatName,
                    name: uname,
                    message: textarea1.value
                });
                event.preventDefault();
            }
            else{
                socket.emit('typing', uname);
            }
        });
        newBtn.addEventListener('click', function(){
            console.log("clicked!")
            socket.emit('newChat',{
                cname: cname.value,
                key: key.value
            });
        });
        cnct.addEventListener('click', function(){
            console.log(chatName);
            chatkey=cKey.value;
            console.log(chatkey);
            socket.emit('chat-room',{
                chatRNAME: chatName,
                ckey: cKey.value 
            });
        });
        clearBtn.addEventListener('click', function(){
             socket.emit('clear');
         });
         startBtn.addEventListener('click',function(){
            uname=document.getElementById('username').value;
            pword=document.getElementById('pword').value;
            if(uname=="" || pword==""){
                alert("Invalid data!");
            }
            else{
                socket.emit('login',{
                    uname:uname,
                    pword:pword
                })
            }
         });
         socket.on('verify-user',function(data){
            for(var i=0;i<data.length;i++){
                console.log(uname+"   "+pword);
                if(data[i].uname==uname){
                    if(data[i].password==pword){
                        document.getElementById('namePopUp').style.display="none";
                    }
                }
            }
         });
         socket.on('typing', function(data){
            setStatus(data+' is typing...');
         });

         socket.on('cleared',function(){
             messages.textContent='';
         });
         socket.on('chatNames',function(data){
             console.log(data);
            if(data.length){
                for(var x = data.length-1; x >= 0;x--){ 
                    var chatID = document.createElement('div');
                    chatID.setAttribute('id','chat-names');
                    chatID.textContent = data[x].cname;
                    chatn.appendChild(chatID);
                    chatn.insertBefore(chatID,chatn.firstChild);
                }
            }
         });
         socket.on('chat-names1',function(data){
            for(var i=0;i<data.length;i++){
                console.log(chatName+"   "+chatkey);
                if(data[i].cname==chatName){
                    if(data[i].key==chatkey){
                        document.getElementById("pvmessages").style.display = "block";
                        document.getElementById("messages").style.display = "none";
                        document.getElementById("textarea1").style.display = "block";
                        document.getElementById("textarea").style.display="none";
                        document.getElementById("popUp").style.display="none";
                        socket.emit('newChat-room',chatName);
                    }
                }
            }
         });
         chatn.onclick=function(){
             var x = document.getElementById("chat-names").textContent;
             chatName = x;
             document.getElementById("chatNames").style.display="none";
             document.getElementById("chat-n").style.display="none";
             document.getElementById("chatKey").style.display="block";
             document.getElementById("new").style.display="none";
             document.getElementById("cnct").style.display="block";
         };
    }
    
})();

