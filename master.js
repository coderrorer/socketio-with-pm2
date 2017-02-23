'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('colors');
var Pm2Socket = require('./socket');
var Pm2Namespace = require('./namespace');
module.exports = function () {
    (0, _createClass3.default)(Pm2SocketIO, null, [{
        key: 'getIp',
        value: function getIp() {
            var os = require('os');
            var interfaces = os.networkInterfaces();
            for (var k in interfaces) {
                for (var k2 in interfaces[k]) {
                    var address = interfaces[k][k2];
                    if (address.family === 'IPv4' && !address.internal) {
                        return address.address;
                    }
                }
            }
            return 'localhost';
        }
    }, {
        key: 'getInstanceId',
        value: function getInstanceId() {
            return parseInt(process.env.NODE_APP_INSTANCE || 0);
        }
    }]);

    function Pm2SocketIO(opts) {
        (0, _classCallCheck3.default)(this, Pm2SocketIO);

        opts = (0, _extends3.default)({}, {
            ips: [],
            localIp: 'localhost'
        }, opts);
        this.addresses = opts.ips;
        this.localIp = opts.localIp;
        this.instanceId = Pm2SocketIO.getInstanceId();
        try {
            if (opts.localIp != 'localhost') {
                this.localIp = Pm2SocketIO.getIp();
            }
            if (this.addresses.indexOf(this.localIp) == -1 && this.addresses.length >= 2) {
                throw new Error('本机IP不在IP列表当中,请在第二个参数ips中添加');
            } else if (this.addresses.length <= 1) {
                this.addresses = ['localhost'];
                this.localIp = 'localhost';
            }
        } catch (e) {
            console.error(e);
        }
    }

    (0, _createClass3.default)(Pm2SocketIO, [{
        key: 'listen',
        value: function listen(port) {
            var _this = this;

            var server = require("http").createServer(function (req, res) {});
            server.listen(port + this.instanceId);
            this.io = require("socket.io")(server);

            var ioClient = require("socket.io-client");

            var processList = [];
            for (var i = 0; i < (process.env.instances || 1); i++) {
                processList.push(i);
            }
            this.addresses.map(function (ip) {
                processList.map(function (id) {
                    setTimeout(function () {
                        var url = 'http://' + ip + ':' + (port + parseInt(id));

                        var connect = void 0;
                        try {

                            connect = ioClient.connect(url, { 'force new connection': true });
                        } catch (e) {
                            console.error(e);
                        }
                        connect.on('@toServer', function (event, namespace) {
                            for (var _len = arguments.length, data = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                                data[_key - 2] = arguments[_key];
                            }

                            if (_this.instanceId != id || ip != _this.localIp) {
                                var _io$of;

                                (_io$of = _this.io.of(namespace || '/')).emit.apply(_io$of, [event].concat(data));
                            }
                        });
                    }, 0);
                });
            });
            return this;
        }
    }, {
        key: 'on',
        value: function on(event, cb) {
            var _this2 = this;

            if (event == 'connection') {
                this.io.on(event, function (socket) {
                    var s = new Pm2Socket(socket, _this2.io);
                    cb(s);
                });
            } else this.io.on(event, function () {
                cb.apply(undefined, arguments);
            });
        }
    }, {
        key: 'emit',
        value: function emit(event) {
            var _io$sockets, _io$sockets2;

            for (var _len2 = arguments.length, data = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                data[_key2 - 1] = arguments[_key2];
            }

            (_io$sockets = this.io.sockets).emit.apply(_io$sockets, ['@toServer', event, '/'].concat(data));
            (_io$sockets2 = this.io.sockets).emit.apply(_io$sockets2, [event].concat(data));
        }
    }, {
        key: 'of',
        value: function of(namespace) {
            return new Pm2Namespace(this.io, namespace);
        }
    }]);
    return Pm2SocketIO;
}();