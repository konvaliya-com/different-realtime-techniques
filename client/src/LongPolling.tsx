import axios from 'axios';
import { useEffect, useState } from 'react';

const LongPolling = () => {
  const [messages, setMessages] = useState<{ id: number, message: string }[]>([]);
  const [value, setValue] = useState('');

  useEffect(() => {
    subscribe();
  }, []);

const subscribe = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/get-messages');
      setMessages(prev => [data, ...prev]);
      // получили ответ от сервера, и соединение закрылось
      // поэтому сразу отправляем запрос и снова ждем ответ
      await subscribe();
    } catch (e) {
      // когда время ожидания от сервера истекло (или если произошла ошибка), то через время пробуем подключиться снова
      setTimeout(subscribe, 500);
    }
}

  const sendMessage = async () => {
    await axios.post('http://localhost:5000/new-message', {
      message: value,
      id: Date.now()
    })
  }

  return (
    <div className="center">
        <div>
            <div className="form">
                <input value={value} onChange={e => setValue(e.target.value)} type="text"/>
                <button onClick={sendMessage}>Отправить</button>
            </div>
            <div className="messages">
                {messages.map(m =>
                    <div className="message" key={m.id}>
                        {m.message}
                    </div>
                )}
            </div>
        </div>
    </div>
);
};

export default LongPolling;