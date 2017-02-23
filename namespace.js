'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Pm2Socket = require('./socket');
module.exports = function () {
    function Namespace(io, namespace) {
        (0, _classCallCheck3.default)(this, Namespace);

        this.io = io;
        this.namespace = namespace;
    }

    (0, _createClass3.default)(Namespace, [{
        key: 'on',
        value: function on(event, cb) {
            var _this = this;

            if (event == 'connection') {
                this.io.of(this.namespace).on(event, function (socket) {
                    var s = new Pm2Socket(socket, _this.io, _this.namespace);
                    cb(s);
                });
            } else this.io.of(this.namespace).on(event, function () {
                cb.apply(undefined, arguments);
            });
        }
    }, {
        key: 'emit',
        value: function emit(event) {
            var _io$sockets, _io$of$sockets;

            for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                data[_key - 1] = arguments[_key];
            }

            (_io$sockets = this.io.sockets).emit.apply(_io$sockets, ['@toServer', event, this.namespace].concat(data));
            (_io$of$sockets = this.io.of(this.namespace).sockets).emit.apply(_io$of$sockets, [event].concat(data));
        }
    }]);
    return Namespace;
}();