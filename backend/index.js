const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./models');
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');
const http = require('http');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// basic health
app.get('/healthz', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 8001;
const server = http.createServer(app);

// integrate socket.io for real-time chat
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('join', (room) => { socket.join(room); });
  socket.on('message', (payload) => {
    if(payload && payload.room) {
      io.to(payload.room).emit('message', { user: payload.user, text: payload.text, ts: Date.now() });
    }
  });
  socket.on('disconnect', () => console.log('socket disconnected', socket.id));
});

db.sequelize.sync().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}).catch(err => {
  console.error('DB sync error:', err);
});
