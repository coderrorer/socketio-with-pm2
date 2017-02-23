/**
 * Created by denniszhang on 17/2/23.
 */
var Pm2Socket = require('./socket')
module.exports = class Namespace {
    constructor(io, namespace) {
        this.io = io;
        this.namespace = namespace;
    }

    on(event, cb) {
        if (event == 'connection') {
            this.io.of(this.namespace).on(event, socket=> {
                var s = new Pm2Socket(socket, this.io,this.namespace);
                cb(s);
            })
        }
        else this.io.of(this.namespace).on(event, function (...data) {
            cb(...data);
        })
    }

    emit(event, ...data) {
        this.io.sockets.emit('@toServer', event,this.namespace, ...data);
        this.io.of(this.namespace).sockets.emit(event, ...data);
    }

}