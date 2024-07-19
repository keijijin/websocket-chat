const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('WebSocket server is running');
});

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  const userName = socket.handshake.query.userName;

  console.log(`${userName} connected`);

  socket.on('message', (data) => {
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log(`${userName} disconnected`);
  });
});

server.listen(8080, () => {
  console.log('WebSocket server is running on port 8080');
});
