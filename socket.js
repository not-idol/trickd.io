'use strict';
module.exports = function(io, socket, lock, RM, Player) {

  function socketJoinsLobby(lobby) {
    var _tmp = lobby.getPlayers();
    var sockets = _tmp.sockets;
    var data = {
      players: _tmp.players,
      url: lobby.url
    }

    for(let i = 0; i < sockets.length; i++) {
      var socket = sockets[i];
      data.admin = socket.player.admin;
      socket.emit('join', data);
    }
  }

  // create games
  socket.on('createNewGame', async function(creator) {
    var task = {
      async execute() {
        var lobby = RM.createNewLobby();
        socket.player = new Player(creator.username, creator.style, true);
        socket.lobbyUrl = lobby.url;
        socket.join(lobby.url);
        lobby = RM.addPlayerToLobby(lobby, socket);
        socketJoinsLobby(lobby);
      }
    }
    await executeTask(task, "lockLobbyCreate");
  });

  // join a lobby
  socket.on('join', async function(data) {
    var task = {
      async execute() {
        var lobby = RM.getLobby(data.requestedLobbyUrl);
        if(!lobby) {
          socket.emit('reloadPage');
          return;
        }
        socket.player = new Player(data.username, data.style, false);
        socket.lobbyUrl = lobby.url;
        socket.join(lobby.url);
        lobby = RM.addPlayerToLobby(lobby, socket);
        socketJoinsLobby(lobby);
      }
    }
    await executeTask(task, "lockLobbyJoin_" + data.requestedLobbyUrl);
  });

  // disconnect
  socket.on('disconnect', async function(){
    var task = {
      async execute() {
        var lobby = RM.getLobby(socket.lobbyUrl);
        if (!lobby) {
          return;
        }

        lobby = RM.removePlayerFromLobby(lobby, socket);
        if (lobby.getPlayers()["sockets"].length == 0) {
          RM.deleteLobby(lobby);
          return;
        }

        if(socket.player.admin) {
          RM.setNewAdmin(lobby);
          lobby = RM.getLobby(socket.lobbyUrl);
        }
        socketJoinsLobby(lobby);
      }
    }
    if(socket.player) {
      await executeTask(task, "lockLobbyJoin_" + socket.lobbyUrl);
    }
  });

  async function executeTask(task, lockString) {
    const unlock = await lock(lockString);
    try {
      await task.execute();
    } catch (e) {
      throw e;
    } finally {
      unlock();
    }
  }
};
