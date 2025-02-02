import axios from 'axios';
import { useEffect, useState } from 'react';

const ServerSentEvents = () => {
  const [messages, setMessages] = useState<{ id: number, message: string }[]>([]);
  const [value, setValue] = useState('');

  useEffect(() => {
    subscribe();
  }, []);

  const subscribe = async () => {
    const eventSource = new EventSource('http://localhost:5000/connect');

    eventSource.onmessage = (event) => {
      console.log(event);
      
      const message = JSON.parse(event.data);
      setMessages(prev => [message, ...prev]);
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

export default ServerSentEvents;