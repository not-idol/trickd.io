require('file-loader?name=[name].[ext]!./index.html');
import './css/style.css'

const io = require("socket.io-client");
var socket = io('http://localhost:3030');

var defaultStyle = {
  color: 'blue'
}

var defaultName = "Marten";
var hello = document.getElementById("hello");

socket.on('connect', () => {
  hello.innerHTML = "Hello, my socket id is: " + socket.id;
  var roomId = window.location.pathname.substr(1);
  if (roomId.length > 0) {
    socket.emit("findRoom",roomId);
  } else {
    socket.emit('createRoom', {username: defaultName, style: defaultStyle});
  }
});

socket.on('findRoom', async function(room) {
  hello.innerHTML = "Hello, this is the room: " + room.id + "\n" +
                    "Rounds: " + room.settings.rounds + "\n" +
                    "Question pool: " + room.settings.numberOfQuestions + "\n" +
                    "timer: " + room.settings.timer;
  console.log(room.settings);
})
