const express = require('express');
const http = require('http');
const Socket = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = Socket(http);

io.listen(server);

app.use(express.static(path.join(__dirname, 'public')));

const usersOnline = [];

io.on('connection', (socket) => {
  socket.on('add user', (username) => {
    socket.nickname = username;
    io.emit('system message', `系统消息：${username}加入了聊天。`);

    usersOnline.push(socket.nickname);
    console.log(usersOnline);
    io.emit('update users status', usersOnline);
  });

  socket.on('disconnect', () => {
    // console.log(`User ${socket.id} disconnected.`);
    if (socket.nickname) {
      io.emit('system message', `系统消息：${socket.nickname}离开了。`);

      // console.log('删除前' + usersOnline);
      usersOnline.splice(
        usersOnline.findIndex((username) => username === socket.nickname),
        1
      );
      io.emit('update users status', usersOnline);
      // console.log('删除后' + usersOnline);
    }
  });

  socket.on('chat message', (msg) => {
    const fullMsg = {
      user: socket.nickname,
      content: msg,
    };

    socket.broadcast.emit('chat message', fullMsg);
  });
});

server.listen(3000, () => {
  console.log('Listening on port: 3000');
});
