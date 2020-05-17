module.exports = function(io, socket, lock, RM, Player) {

  // freshly joined
  function newJoin(room, socket) {
    socket.leaveAll();
    socket._joinedRoom_ = room.id;
    socket.join(room.id);
    socket.emit('joinLobby', room.id);
    io.sockets.in(room.id).emit('newJoinToLobby', room.getPlayers());
    if(socket.player.admin) {
      socket.emit('unlockSettings');
    }
  }

  function setNewAdmin(admin) {
    var adminSocket = io.of("/").connected[admin.id];
    adminSocket.player = admin;
    adminSocket.emit('unlockSettings');
  }

  // create games
  socket.on('createNewGame', async function(creator) {
    socket.player = new Player(socket.id, creator.username, creator.style, true);
    const unlock = await lock('lockGameCreation');
    try {
      var createdRoom = RM.createNewGame(socket.player);
      newJoin(createdRoom, socket);
    } catch (e) {
      throw e;
    } finally {
      unlock();
    }
  });

  // join a lobby
  socket.on('joinGame', async function(player) {
    const unlock = await lock('lockLobbyInteraction' + player.requestedRoomId);
    var room = RM.getRoom(player.requestedRoomId);
    if(!room || player.requestedRoomId.length < 1) {
      socket.emit('reloadPage');
    } else {
      socket.player = new Player(socket.id, player.username, player.style, false);
      try {
        var room = RM.addPlayerToRoom(room.id, socket.player);
        newJoin(room, socket);
      } catch (e) {
        throw e;
      } finally {
        unlock();
      }
    }
  });

  // disconnect
  socket.on('disconnect', async function(){
    if(socket.player) {
      id = socket._joinedRoom_;
      const unlock = await lock('lockLobbyInteraction' + id);
      try {
        var {players, admin} = RM.removePlayerFromRoom(id, socket.player);
        if(players) {
          if(players.length > 0) {
            // update remove
            io.sockets.in(id).emit('newJoinToLobby', players);
            setNewAdmin(admin);
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
  });

};
