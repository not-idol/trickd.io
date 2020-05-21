require('file-loader?name=[name].[ext]!./index.html');
import './css/style.css'
import Logo from './images/logo.svg';

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
    var requestedLobbyUrl = window.location.pathname.replace("/", "").replace("?", "");
    socket.emit('join', {username: username, style: style, requestedLobbyUrl: requestedLobbyUrl});
  }
  document.getElementById('username').addEventListener('input', function (evt) {
    username = this.value || defaultUsername;
  });

  document.getElementById('color').addEventListener('input', function (evt) {
    style.color = this.value || defaultStyle.color;
  });

  showHomeStage();

  var path = window.location.pathname.replace("/", "").replace("?", "");
  if(path.length > 0) {
    showJoinStage();
  }

  function showSection(section, b) {
    section.style.display = b ?  "block" : "none";
  }

  function showHomeStage() {
    showSection(stylingSection, true);
    showSection(createGameSection, true);
    showSection(lobbySection, false);
    showSection(joinGameSection, false);
  }

  function showJoinStage() {
    showSection(createGameSection, false);
    showSection(joinGameSection, true);
  }

  function showLobbyStage() {
    showSection(stylingSection, false);
    showSection(createGameSection, false);
    showSection(joinGameSection, false);
    showSection(lobbySection, true);
  }

  function createPTag(text) {
    var para = document.createElement("P");
    para.innerText = text;
    return para;
  }

  var joined = false;
  socket.on('join', function(data) {
    if(!joined) {
      joined = true;
      var joinUrl = window.location.origin + "/" + data.url;
      showLobbyStage();
      document.getElementById("joinLink").innerText = "Send this link to your friends: " + joinUrl;
      document.getElementById("joinLink").href = joinUrl;
    }

    var players = data.players;
    var playerSection = document.getElementById('players');
    playerSection.innerHTML = "";
    for(let i = 0; i < players.length; i++) {
      playerSection.appendChild(createPTag(players[i].username + (players[i].admin ? " (admin)" : "")));
    }

    if(data.admin) {
      document.getElementById("rounds").disabled = false;
      document.getElementById("questionQuantity").disabled = false;
      document.getElementById("timer").disabled = false;
    }
  });

  socket.on('reloadPage', function() {
    location.reload();
  });

});
