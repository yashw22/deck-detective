import  { useState, useEffect } from "react";
import { ref, set} from "firebase/database";
import Peer from "peerjs";
import database from "../../../firebaseConfig";

const FirebaseChat = () => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [peer, setPeer] = useState(null);
  const [connection, setConnection] = useState(null);
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  useEffect(() => {
    // Initialize PeerJS
    const peerInstance = new Peer();
    setPeer(peerInstance);

    peerInstance.on("open", (id) => {
      console.log("My peer ID is:", id);
      setPeerId(id);

      // Save peer ID to Firebase
      const peerRef = ref(database, `peers/${id}`);
      set(peerRef, { id });
    });

    peerInstance.on("connection", (conn) => {
      conn.on("data", (data) => {
        console.log("Received:", data);
        setChatLog((prev) => [...prev, { sender: "Remote", message: data }]);
      });
      setConnection(conn);
    });
  }, []);

  const connectToPeer = () => {
    const conn = peer.connect(remotePeerId);
    conn.on("open", () => {
      console.log("Connected to:", remotePeerId);
      setConnection(conn);
    });
    conn.on("data", (data) => {
      console.log("Received:", data);
      setChatLog((prev) => [...prev, { sender: "Remote", message: data }]);
    });
  };

  const sendMessage = () => {
    if (connection && message) {
      connection.send(message);
      setChatLog((prev) => [...prev, { sender: "You", message }]);
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Peer-to-Peer Chat</h1>
      <p>Your Peer ID: {peerId}</p>
      <input
        value={remotePeerId}
        onChange={(e) => setRemotePeerId(e.target.value)}
        placeholder="Remote Peer ID"
      />
      <button onClick={connectToPeer}>Connect</button>
      <div>
        <div style={{ height: "200px", overflowY: "scroll", border: "1px solid #ccc" }}>
          {chatLog.map((log, i) => (
            <p key={i}>
              <strong>{log.sender}:</strong> {log.message}
            </p>
          ))}
        </div>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default FirebaseChat;
