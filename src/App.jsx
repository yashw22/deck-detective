import { useState, useRef, useEffect } from "react";
import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid";

const App = () => {
  const [peerId, setPeerId] = useState("");
  const [connectionId, setConnectionId] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const peer = useRef(null);
  const conn = useRef(null);

  // // Initialize Peer instance on component mount
  useEffect(() => {
    const newPeer = new Peer(uuidv4());
    peer.current = newPeer;

    newPeer.on("open", (id) => {
      setPeerId(id);
    });

    newPeer.on("connection", (newConn) => {
      conn.current = newConn;
      conn.current.on("data", handleIncomingMessage);
    });

    return () => {
      newPeer.destroy();
    };
  }, []);

  const handleIncomingMessage = (data) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "Peer", text: data },
    ]);
  };

  const connectToPeer = () => {
    const newConn = peer.current.connect(connectionId);
    conn.current = newConn;

    newConn.on("open", () => {
      console.log("Connection established!");
    });

    newConn.on("data", handleIncomingMessage);
  };

  const sendMessage = () => {
    if (conn.current && conn.current.open) {
      conn.current.send(inputMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "You", text: inputMessage },
      ]);
      setInputMessage("");
    }
  };

  return (
    <div className="app">
      <h1>Peer-to-Peer Chat</h1>
      <p>
        Your Peer ID: <strong>{peerId}</strong>
      </p>

      <div className="connection">
        <input
          type="text"
          placeholder="Enter Peer ID to connect"
          value={connectionId}
          onChange={(e) => setConnectionId(e.target.value)}
        />
        <button onClick={connectToPeer}>Connect</button>
      </div>

      <div className="chat">
        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.sender === "You" ? "outgoing" : "incoming"
              }`}
            >
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
        </div>

        <div className="send">
          <input
            type="text"
            placeholder="Type a message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default App;
