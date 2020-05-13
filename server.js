require("./parser");
const config = require("./config");
const path = require("path");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const DIST_DIR = path.join(__dirname, "dist");
const PORT = config.port;

//Serving the files on the dist folder
app.use(express.static(DIST_DIR));

//Send index.html when the user access the web
app.get("*", function (req, res) {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

http.listen(PORT, () => {
  console.log("listen on " + PORT + ".");
});

io.on('connection', (socket) => {
  console.log('a user connected');
});
