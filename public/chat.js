/*------------------wallpaper change-------------------- */
(function(){
    var element = function(id){
        return document.getElementById(id);
    }

    var status = element('status');
    var messages = element('messages');
    var textarea = element('textarea');
    var username = element('username');
    var clearBtn = element('clear');
    var newBtn = element('new');
    var chatn= element('chat-names');

    var statusDefault = '';


    var setStatus = function(s){
        status.textContent = s;

        if(s!==statusDefault){
            console.log('Message will dissapear!')
            var delay = setTimeout(function(){
                setStatus('');
            },4000);
        }
    }

    var socket = io.connect('https://stark-depths-16759.herokuapp.com');

    if(socket !== undefined){
        console.log('Connected to socket...');

        socket.on('output',function(data){
            console.log(data);
            if(data.length){
                for(var x = data.length-1; x >= 0;x--){
                    var message = document.createElement('div');
                    message.setAttribute('class','chat-message');
                    message.innerHTML = '<span class="name">'+data[x].name +'</span>&nbsp&nbsp'+data[x].message;
                    messages.appendChild(message);
                    messages.insertBefore(message,messages.firstChild);
                }
            }
        });
        socket.on('status',function(data){
            setStatus((typeof data === 'object')? data.message:data);

            if(data.clear){
                textarea.value = '';
            }
        });

        textarea.addEventListener('keydown',function(event){
            if(event.which===13){
                socket.emit('input',{
                    name: username.value,
                    message: textarea.value
                });
                event.preventDefault();
            }
            else{
                socket.emit('typing', username.value);
            }
        });
        newBtn.addEventListener('click', function(){
            console.log("clicked!")
            socket.emit('newChat',{
                cname: cname.value,
                key: key.value
            });
        });
        clearBtn.addEventListener('click', function(){
             console.log("clear button");
             socket.emit('clear');
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
                    chatID.setAttribute('class','chat-names');
                    chatID.textContent = data[x].cname;
                    chatn.appendChild(chatID);
                    chatn.insertBefore(chatID,chatn.firstChild);
                }
            }
         });
    }
    
})();

