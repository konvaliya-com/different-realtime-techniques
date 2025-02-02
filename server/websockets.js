import {WebSocketServer} from 'ws';

const wsServer = new WebSocketServer({ 
  port: 5000,
  // noServer: true 
}, () => {
  console.log('Websocket server running on port 5000');
  }
);


const broadcast = (message, id) => {
  wsServer.clients.forEach(client => {
    // if(client.id === id) {
      client.send(JSON.stringify(message));
    // }
  });
};

// когда клиент подключается к серверу, есть error, close, 
wsServer.on('connection', (ws) => {

  // для того, чтобы сделать приватные комнаты, можем присваоить каждому клиенту id комнаты
  // и в broadcast отправлять сообщение только тем клиентам, у которых id комнаты совпадает
  // ws.id = Date.now();

  // ws - это объект, который представляет подключенного клиента
  // подписываемся на событие message, есть еще open, close, error, ping/pong, upgrade
  ws.on('message', (message) => {
    message = JSON.parse(message);// обмен сообщениями в строковом формате
    // все поля в message - это поля, которые мы отправляем с фронтенда
    // и они кастомные, могут быть любыми
    // структура нашего сообщения {event: 'message или connection', id, date, username, message}
    switch (message.event) {
      case 'message':
        // отправляем сообщение всем клиентам
        // если написать ws.send, то сообщение отправится только тому клиенту, который его отправил
        // wsServer.clients - это массив всех подключенных клиентов
        broadcast(message);
        break;
      case 'connection':
        console.log('connection', message);
        
        // для connection, может быть другая логика, тут такая же
        broadcast(message);
        break;
    }
    
  });
});

