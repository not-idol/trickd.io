require("./parser");
const config = require("./config");
const path = require("path");
const client = require('redis').createClient();
const { promisify } = require('util');
const lock = promisify(require('redis-lock')(client));
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


app.get("/:id", function (req, res, next) {
  var id = String(req.params.id).replace("?", "");
  if(RM.getRoom(id)) {
    next();
  } else {
    res.status(200).send({m: "room not found mate."});
  }
});

app.get("*", function (req, res) {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

http.listen(PORT, () => {
  console.log("listen on " + PORT + ".");
});

const Player = require("./player");
io.on('connection', (socket) => {

  function newJoin(room, socket) {
    socket.leaveAll();
    socket._joinedRoom_ = room.id;
    socket.join(room.id);
    socket.emit('joinLobby', room.id);
    io.sockets.in(room.id).emit('newJoinToLobby', room.getPlayers());
  }

  socket.on('createNewGame', async function(creator) {
    const unlock = await lock('lockGameCreation');
    try {
      socket.player = new Player(socket.id, creator.username, creator.style, true);
      var createdRoom = RM.createNewGame(socket.player);
      newJoin(createdRoom, socket);
    } catch (e) {
      throw e;
    } finally {
      unlock();
    }
  });

  socket.on('joinGame', async function(player) {
    var room = RM.getRoom(player.requestedRoomId);
    if(!room) {
      socket.emit('reloadPage');
    } else {
      const unlock = await lock('lockLobbyInteraction');
      try {
        socket.player = new Player(socket.id, player.username, player.style, false);
        var room = RM.addPlayerToRoom(room.id, socket.player);
        newJoin(room, socket);
      } catch (e) {
        throw e;
      } finally {
        unlock();
      }
    }
  });

  socket.on('disconnect', async function(){
    if(socket.player) {
      id = socket._joinedRoom_;
      const unlock = await lock('lockLobbyInteraction');
      try {
        var players = RM.removePlayerFromRoom(id, socket.player);
        if(players) {
          if(players.length > 0) {
            io.sockets.in(id).emit('newJoinToLobby', players);
          }
          if(players.length == 0) {
            RM.deleteRoom(id);
          }
        }
      } catch (e) {
        throw e;
      } finally {
        unlock();
      }
    }
  })
});
