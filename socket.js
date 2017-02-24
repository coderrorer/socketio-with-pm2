'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
    function Socket(socket, io, namespace) {
        (0, _classCallCheck3.default)(this, Socket);

        this.socket = socket;
        this.namespace = namespace;
        this.io = io;
        var self = this;
        this.broadcast = {
            emit: this.broadcastEmit.bind(self)
        };
    }

    (0, _createClass3.default)(Socket, [{
        key: 'broadcastEmit',
        value: function broadcastEmit(event) {
            var _io, _socket$broadcast;

            for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                data[_key - 1] = arguments[_key];
            }

            (_io = this.io).emit.apply(_io, ['@toServer', event, this.namespace || '/'].concat(data));
            (_socket$broadcast = this.socket.broadcast).emit.apply(_socket$broadcast, [event].concat(data));
        }
    }, {
        key: 'on',
        value: function on(event, cb) {
            this.socket.on(event, function () {
                cb.apply(undefined, arguments);
            });
        }
    }, {
        key: 'emit',
        value: function emit(event) {
            var _socket;

            for (var _len2 = arguments.length, data = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                data[_key2 - 1] = arguments[_key2];
            }

            (_socket = this.socket).emit.apply(_socket, [event].concat(data));
        }
    }, {
        key: 'disconnect',
        value: function disconnect(close) {
            this.socket.disconnect(close);
        }
    }]);
    return Socket;
}();