require('file-loader?name=[name].[ext]!./index.html');
import './css/style.css'

var hello = document.getElementById("hello");
hello.innerHTML = "Hello from Webpack!";

const io = require("socket.io-client");
var socket = io('http://localhost:3030');
