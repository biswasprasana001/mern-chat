// socket.js
const socketIO = require('socket.io');

let io;

function initSocket(server) {
  io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error('Socket.IO has not been initialized');
  }
  return io;
}

module.exports = { initSocket, getIO };
