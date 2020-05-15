require('file-loader?name=[name].[ext]!./index.html');
import './css/style.css'

const io = require("socket.io-client");
var socket = io('http://localhost:3030');

var defaultStyle = {
  color: 'blue'
}

var defaultName = String(Math.random());

socket.on('connect', () => {

});

socket.on('joinRoom', async function(room) {
  document.getElementById('text').innerHTML = "Room from " + room.admin+
  " send this link to friends: /" + room.id;

  var pl = document.getElementById('playerlist');
  pl.innerHTML = "";
  for (let i = 0; i < room.players.length; i++) {
    var node = document.createElement("LI");
    var t = document.createTextNode(room.players[i].name);
    node.appendChild(t);
    pl.appendChild(node);
  }
});

socket.on('roomDoesntExist', function() {
  alert("This room doesnt exist, check the url!");
});

document.getElementById('createRoomButton').onclick = async function() {
  socket.emit('createRoom', {name: defaultName, style: defaultStyle});
}

document.getElementById('joinRoomButton').onclick = async function() {
  var roomId = window.location.pathname.substr(1);
  if(roomId.length > 0) {
    var data = {playerData: {name: defaultName, style: defaultStyle}, roomId: roomId};
    socket.emit('joinRoom', data);
  }
}
