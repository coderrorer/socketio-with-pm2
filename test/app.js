/**
 * Created by denniszhang on 17/2/23.
 */
var Pm2Socketio = require('../index');
var io = new Pm2Socketio();
io.listen(3001);
io.of('/chat').on('connection', socket=> {
    console.log('connect success!')
    socket.on('eventSave', data=> {
        socket.broadcast.emit('eventUpdate', data);
    })
})