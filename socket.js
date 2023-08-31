// socket.js
const socketIO = require('socket.io');

let io;

function initSocket(server) {
  io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
}

function getIO() {
  return io;
}

module.exports = { initSocket, getIO };
