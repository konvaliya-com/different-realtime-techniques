import express from 'express';
import cors from 'cors';

import events from 'events';
const eventEmitter = new events.EventEmitter();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/connect', (req, res) => {

  // для того, чтобы SSE работал, нужно установить заголовки
  // res.setHeader не завершает соединение, а просто устанавливает заголовки
  // после res.writeHead уже нельзя написать res.json 
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
  });

  // тут уже .on вместо .once, так как клиент будет оставаться подключенным
  // и событие будет срабатывать не ограниченное количество раз
  eventEmitter.on('newMessage', (message) => {
    // res.send - для отправки целостного ответа
    // res.write - для отправки ответа по частям, нужно для SSE
    // не завершает соединение, а отправляет данные
    // для завершения соединения res.end()
    // сообщения в SSE обязаны быть в формате data: {message}
    // иначе на клиенте не сработает обработчик события onmessage
    res.write(`data: ${JSON.stringify(message)} \n\n`);
  });

});
app.post('/new-message', (req, res) => {
  const message = req.body;
  eventEmitter.emit('newMessage', message);
  res.status(200).send('Message received');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
