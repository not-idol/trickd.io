require("./parser");
const config = require("./config");
const path = require("path");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const bodyParser = require('body-parser');
const io = require("socket.io")(http);
const RM = new (require("./roomManager"))();
const DIST_DIR = path.join(__dirname, "dist");
const PORT = config.port;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Serving the files on the dist folder
app.use(express.static(DIST_DIR));

//Send index.html when the user access the web
app.get("/", function (req, res) {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

app.get("/:id", function (req, res) {
  var id = String(req.params.id).replace("?", "");
  var room = RM.findRoom(id);
  if(room) {
    res.sendFile(path.join(DIST_DIR, "index.html"));
  } else {
    res.status(200).send({m: "sorry, this room doesnt exist!"});
  }
});

http.listen(PORT, () => {
  console.log("listen on " + PORT + ".");
});

const Player = require("./player");
io.on('connection', (socket) => {

  socket.on('createRoom', async function(admin) {
    socket.player = new Player(socket.id, admin.name, admin.style, true);
    var room = RM.createNewRoom();
    newJoin(socket, room);
  });

  socket.on('joinRoom', async function(data) {
    if(socket.joinedRoom) {
      return;
    }

    var playerData = data.playerData;
    var roomId = data.roomId;

    if(RM.doesRoomExist(roomId)) {
      socket.player = new Player(socket.id, playerData.name, playerData.style, false);
      var room = RM.findRoom(roomId);
      newJoin(socket, room);
    } else {
      socket.emit('roomDoesntExist');
    }
  });

  function newJoin(socket, room) {
    socket.leaveAll();
    socket.join(room.id);
    socket.joinedRoom = true;
    RM.addNewPlayerToRoom(socket.player, room.id);
    io.sockets.in(room.id).emit('joinRoom', {
      id: room.id,
      admin: room.admin.name,
      players: room.infoPlayers
    }
  );
  }
});
