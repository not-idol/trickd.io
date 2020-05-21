'use strict';
require("./parser");
const config = require("./config");
const path = require("path");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const bodyParser = require('body-parser');
const io = require("socket.io")(http);
const client = require('redis').createClient();
const { promisify } = require('util');
const lock = promisify(require('redis-lock')(client));
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
  if(RM.getLobby(id)) {
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

io.on('connection', (socket) => {
  require('./socket')(io, socket, lock, RM, require("./player"));
});
