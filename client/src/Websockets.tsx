import { useRef, useState } from 'react';

type Message = {
  event: 'connection' | 'message';
  username: string;
  id: number;
  message: string;
}


const Websockets = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [value, setValue] = useState('');
  const websocket = useRef<WebSocket>();
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState('');  
  const [roomId, setRoomId] = useState('');

  const connect = () => {
    websocket.current = new WebSocket('ws://localhost:5000?roomId=' + roomId);
    
    websocket.current.onopen = () => {
      setIsConnected(true);
      const message = {
        event: 'connection',
        username,
        roomId,
      }

      websocket.current?.send(JSON.stringify(message));
    }
    
    websocket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [message, ...prev]);
    }

    websocket.current.onclose = () => {
      console.log('Socket closed');
    }

    websocket.current.onerror = () => {
      console.log('Socket error');
    }
  }

  const sendMessage = async () => {
    const message = {
      username,
      message: value,
      roomId,
      event: 'message'
    }
    websocket.current?.send(JSON.stringify(message));
    setValue('');
  }

  if (!isConnected) {
    return (
        <div className="center">
            <div className="form">
                <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    type="text"
                    placeholder="Enter your name"/>
                <input
                    value={roomId}
                    onChange={e => setRoomId(e.target.value)}
                    type="string"
                    placeholder="Enter room id"/>
                <button onClick={connect}>Join</button>
            </div>
        </div>
    )
  }

  return (
    <div className="center">
        <div>
            <div className="form">
                <input value={value} onChange={e => setValue(e.target.value)} type="text"/>
                <button onClick={sendMessage}>Send</button>
            </div>
            <div className="messages">
                {messages.map(m =>
                    <div key={m.id}>
                        {m.event === 'connection'
                            ? <div className="connection_message">
                                User {m.username} connected
                            </div>
                            : <div className="message">
                                {m.username}. {m.message}
                            </div>
                        }
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default Websockets;