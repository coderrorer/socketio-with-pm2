# socketio-with-pm2

This is an nodejs plugin for socketio, which support socketio run with the cluster mode of pm2.

There are very few ways to make socketio and pm2-cluster-mode work together because of the handshake action. 

You can check the detail reason here : http://socket.io/docs/using-multiple-nodes/
 
The socket.io official solution for this problem is to use redis to handle data in on place.

This plugin `socketio-with-pm2` provide another solution without redis.




## How to use:

`$ npm install socketio-with-pm2`

#### Server Side

write in app.js at root of the project:
 
    var Pm2Socketio = require('socketio-with-pm2');    
    var io = new Pm2Socketio();
    io.listen(3001);
    io.on('connection', socket=> {
        socket.on('eventSave', data=> {
            socket.broadcast.emit('eventUpdate', data);
        })
    })
    
    
Then you need to send the local IP address and pm2 thread instanceID to the client so client can connect to the server.
if you are using koa and ejs-render engine, you can write like this:

in action file: 
    
    const swp = require('socketio-with-pm2');
    module.exports = function*(next) {
        let ip = swp.getIp();
        let port = swp.getInstanceId();
        yield this.render('index', {
            port,
            ip
        });
        
    };
    
in index.ejs:

    <html>
        <head></head>
        <body>
        
            ...YOUR FILE CONTENT...
            
            <script>
                window.port = <%=port%>;
                window.ip = '<%=ip%>';
            </script>
            
        </body>
    </html>
    
#### Client Side

    
    const io = require('socket.io-client');
    url = `${window.ip}:${3001+window.port}`;  //3001 is the port number which you declare in the server side 
    var socket = io.connect(url, {'force new connection': true});
    
Then you can visit with the socket
    

    
    
 

    


