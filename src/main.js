require('file-loader?name=[name].[ext]!./index.html');
import './css/style.css'
import Logo from './logo.svg';

const io = require("socket.io-client");
var socket = io('http://localhost:3030');


var defaultStyle = {
  color: 'blue'
}
var defaultUsername = 'Bob';

var username = defaultUsername;
var style = defaultStyle;

socket.on('connect', () => {
  console.log('Connected to the servers!');
});

document.addEventListener("DOMContentLoaded", function(event) {
  var stylingSection = document.getElementById('styling');
  var createGameSection = document.getElementById('createGame');
  var lobbySection = document.getElementById('lobby');
  var joinGameSection = document.getElementById('joinLobby');

  document.getElementById('logo').innerHTML = Logo;
  document.getElementById('createGameButton').onclick = function() {
    socket.emit('createNewGame', {username: username, style: style});
  }
  document.getElementById('joinGameButton').onclick = function() {
    socket.emit('joinGame', {username: username, style: style, requestedRoomId: window.location.pathname.replace("/", "").replace("?", "")});
  }
  document.getElementById('username').addEventListener('input', function (evt) {
    username = this.value || defaultUsername;
  });

  document.getElementById('color').addEventListener('input', function (evt) {
    style.color = this.value || defaultStyle.color;
  });

  showSection(stylingSection, true);
  showSection(createGameSection, true);
  showSection(lobbySection, false);
  showSection(joinGameSection, false);

  var path = window.location.pathname.replace("/", "").replace("?", "");
  if(path.length > 0) {
    showSection(createGameSection, false);
    showSection(joinGameSection, true);
  }

  function showSection(section, b) {
    section.style.display = b ?  "block" : "none";
  }

  function createPTag(text) {
    var para = document.createElement("P");
    para.innerText = text;
    return para;
  }

  socket.on('joinLobby', function(id) {
    var joinUrl = window.location.origin + "/" + id;
    showSection(stylingSection, false);
    showSection(createGameSection, false);
    showSection(joinGameSection, false);
    showSection(lobbySection, true);
    document.getElementById("joinLink").innerText = "Send this link to your friends: " + joinUrl;
  });

  socket.on('newJoinToLobby', function(players) {
    console.log(players);
    var playerSection = document.getElementById('players');
    playerSection.innerHTML = "";
    for(let i = 0; i < players.length; i++) {
      playerSection.appendChild(createPTag(players[i].username + (players[i].admin ? " (admin)" : "")));
    }
  });

  socket.on('reloadPage', function() {
    location.reload();
  });

});
