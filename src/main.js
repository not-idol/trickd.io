require('file-loader?name=[name].[ext]!./index.html');
import './assets/css/animate.css';
import './assets/css/lineicons.css';
import './assets/css/bootstrap.min.css';
import './assets/css/default.css';
import './assets/css/style.css';
import './assets/css/gametab.css';
import Logo from './assets/images/logo.svg';
import Background from './assets/images/background.png';
import Download_Shape from './assets/images/download-shape.svg';
import Email from './assets/images/email.svg';
import Footer_Shape from './assets/images/footer-shape.svg';
import Logo_swanz from './assets/images/logo_swanz.svg';
import 'bootstrap';
import './scroll.js'

var io = require("socket.io-client");
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
  var createGameSection = document.getElementById('startup');
  var lobbySection = document.getElementById('lobby');
  var preLobbySection = document.getElementById('preLobby');
  var gameSettingSection = document.getElementById('gameSettings');
  var joinGameSection = document.getElementById('joinLobby');

  document.getElementById('logo').src = Logo;
  document.getElementById('footer-shape').src = Footer_Shape;
  document.getElementById('footer-shape-1').src = Footer_Shape;
  document.getElementById('createlobby').onclick = function() {
    socket.emit('createNewGame', {username: username, style: style});
  }
  document.getElementById('joinlobby').onclick = function() {
    var requestedLobbyUrl = window.location.pathname.replace("/", "").replace("?", "");
    socket.emit('join', {username: username, style: style, requestedLobbyUrl: requestedLobbyUrl});
  }
  document.getElementById('nick').addEventListener('input', function (evt) {
    username = this.value || defaultUsername;
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
    showSection(createGameSection, true);
    showSection(lobbySection, false);
    showSection(joinGameSection, false);
  }

  function showJoinStage() {
    showSection(createGameSection, false);
    showSection(joinGameSection, true);
  }

  function showLobbyStage() {
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
