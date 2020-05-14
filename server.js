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

io.on('connection', (socket) => {
  console.log('a user connected with id: ' + socket.id);

  const Player = require("./player");
  socket.on('createRoom', async function(p) {
    var admin = new Player(p.username, p.style, socket.id);
    socket.player = {admin: true, username: admin.username, style: admin.style};
    console.log(socket.id + " created a new room: ", RM.createNewRoom(admin));
  });

  socket.on('findRoom', async function(roomId) {
    var room = RM.findRoom(roomId);
    if (room) {
      socket.join(room.id);
      socket.emit('findRoom', {id: room.id, settings: room.settings });
    } else {
        socket.emit('findRoom', null);
    }
  })
});
