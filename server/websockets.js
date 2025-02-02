import {WebSocketServer} from 'ws';
import url from 'url';
import { log } from 'console';

const wsServer = new WebSocketServer({ 
  port: 5000,
}, () => {
  console.log('Websocket server running on port 5000');
  }
);


const broadcast = (message, roomId) => {
  wsServer.clients.forEach(client => {
    // client.readyState === WebSocket.OPEN на случай, если клиент отключился
    if (client.roomId === roomId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

wsServer.on('connection', (ws, req) => {
  // для того, чтобы сделать приватные комнаты, присваиваем каждому клиенту id комнаты
  // и в broadcast отправлять сообщение только тем клиентам, у которых id комнаты совпадает с тем, 
  // что пришел в сообщении с клиента
  const parameters = url.parse(req.url, true);
  ws.roomId = parameters.query.roomId;

  ws.on('message', (message) => {
    message = JSON.parse(message);
    // структура нашего сообщения {event: 'message или connection', date, username, message, roomID}
    switch (message.event) {
      case 'message':
        broadcast(message, message.roomId);
        break;
      case 'connection':
        broadcast(message, message.roomId);
        break;
    }
    
  });
});

