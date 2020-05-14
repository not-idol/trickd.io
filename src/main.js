require('file-loader?name=[name].[ext]!./index.html');
import './css/style.css'

const io = require("socket.io-client");
var socket = io('http://localhost:3030');

var defaultStyle = {
  color: 'blue'
}

socket.on('connect', () => {
  var hello = document.getElementById("hello");
  hello.innerHTML = "Hello, my socket id is: " + socket.id;
});

socket.emit('createRoom');
