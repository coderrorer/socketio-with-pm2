/**
 * Created by denniszhang on 17/2/23.
 */
module.exports = class Socket {
    constructor(socket,io,namespace){
        this.socket = socket;
        this.namespace = namespace;
        this.io = io;
        let self = this;
        this.broadcast = {
            emit:this.broadcastEmit.bind(self)
        }
    }
    broadcastEmit(event,...data) {
        this.io.emit('@toServer',event,this.namespace||'/',...data);
        this.socket.broadcast.emit(event,...data);
    }

    on(event,cb){
        this.socket.on(event,(...data)=>{
            cb(...data)
        })
    }
    emit(event,...data){
        this.socket.emit(event,...data);
    }
    disconnect(close){
        this.socket.disconnect(close);
    }
}