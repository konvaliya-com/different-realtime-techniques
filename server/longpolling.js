import express from 'express';
import cors from 'cors';

// для того, чтобы мы могли, по какому-то событию, отправить сообщение клиенту
// нужен способ управления событиями в node.js, через стандартный модуль events
import events from 'events';
const eventEmitter = new events.EventEmitter();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/get-messages', (req, res) => {

  // после того, как пользователь отправил сообщение в new-message
  // всех остальных пользователей нужно уведомить об этом
  // регистрируем слушатель события, сработает 1 раз
  // всем пользователям, у которых висит запрос, отправим новое сообщение
  eventEmitter.once('newMessage', (message) => {
    res.json(message);
  });

  // Из комментов: при реализации long polling нужно обязательно на сервере прописывать res.end(); 
  // во всех контроллерах, иначе в некоторых браузерах, 
  // таких как chrome или firefox вы не сможете отправить больше 5-7 запросов, 
  // т.к. браузер будет ждать ответа на предыдущие, а сервер попросту не отвечает на них.

});
app.post('/new-message', (req, res) => {
  const message = req.body;
  eventEmitter.emit('newMessage', message);
  res.status(200).send('Message received');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
