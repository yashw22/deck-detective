import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Peer from "peerjs";
import { MAX_PLAYERS } from "../config/constants";

export default function CreateGame({ myName }) {
  const myPeerRef = useRef(null);
  const myPeerNameRef = useRef(myName);
  const [myPeerId, setMyPeerId] = useState();

  const [playerCount, setPlayerCount] = useState(0);
  const connListRef = useRef({});

  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedPeer, setSelectedPeer] = useState("");

  useEffect(() => {
    const myPeer = new Peer();
    // const myPeer = new Peer({
    //   host: "peerjs-server-d8ry.onrender.com",
    //   path: "/deckdetective",
    //   secure: true,
    // });
    myPeerRef.current = myPeer;

    myPeer.on("open", (id) => {
      setMyPeerId(id);
      setPlayerCount(1);
    });

    myPeer.on("connection", (newConn) => {
      if (Object.keys(connListRef.current).length < MAX_PLAYERS - 1) {
        const { peerName } = newConn.metadata;
        connListRef.current[newConn.peer] = { conn: newConn, name: peerName };
        setPlayerCount((p) => p + 1);

        broadcastNewConnection(newConn.peer, peerName);
        newConn.on("open", () => {
          shareAllConnections(newConn);
        });

        newConn.on("data", (data) => {
          if (data.type === "testChatBox") {
            addMessage(peerName, data.msg);
            broadcastMessage(
              { sender: peerName, text: data.msg },
              newConn.peer
            );
          } else if (data.type === "broadcast") {
            forwardBroadcast(newConn.peer, data.data);
            processData(newConn.peer, data);
          } else if (data.type === "private") {
            if (data.receiver == myPeerRef.current.id)
              processData(newConn.peer, data);
            else forwardPrivate(newConn.peer, data.receiver, data.data);
          }
        });
      } else newConn.close();
    });

    return () => {
      myPeer.destroy();
    };
  }, []);

  const shareAllConnections = (newConn) => {
    newConn.send({
      type: "newConnData",
      peerId: myPeerRef.current.id,
      peerName: myPeerNameRef.current,
    });
    Object.entries(connListRef.current).forEach(([peerId, obj]) => {
      if (newConn.peer !== peerId) {
        newConn.send({
          type: "newConnData",
          peerId: peerId,
          peerName: obj.name,
        });
      }
    });
  };
  const broadcastNewConnection = (newPeerId, newPeerName) => {
    Object.entries(connListRef.current).forEach(([peerId, peerObj]) => {
      if (newPeerId !== peerId) {
        peerObj.conn.send({
          type: "newConnData",
          peerId: newPeerId,
          peerName: newPeerName,
        });
      }
    });
  };
  const forwardBroadcast = (senderPeerId, data) => {
    Object.entries(connListRef.current).forEach(([peerId, obj]) => {
      if (peerId !== senderPeerId) {
        obj.conn.send({ type: "broadcast", sender: senderPeerId, data: data });
      }
    });
    // alert(`${connListRef.current[senderPeerId].name} says: ${data}`);
  };
  const forwardPrivate = (senderPeerId, receiverPeerId, data) => {
    connListRef.current[receiverPeerId].conn.send({
      type: "private",
      sender: senderPeerId,
      data: data,
    });
  };
  const processData = (senderPeerId, data) => {
    if (data.type === "broadcast") {
      alert(`${connListRef.current[senderPeerId].name} says: ${data.data}`);
    } else if (data.type === "private") {
      alert(
        `**PRIVATE** ${connListRef.current[senderPeerId].name} says: ${data.data}`
      );
    }
  };

  const sendBroadcast = (data) => {
    forwardBroadcast(myPeerRef.current.id, data);
  };
  const sendPrivate = (receiver, data) => {
    forwardPrivate(myPeerRef.current.id, receiver, data);
  };

  const addMessage = (name, message) => {
    setMessages((m) => [...m, { sender: name, text: message }]);
  };
  const broadcastMessage = (message, senderPeerId) => {
    Object.entries(connListRef.current).forEach(([peerId, obj]) => {
      if (peerId !== senderPeerId) {
        obj.conn.send({ type: "testChatBox", msg: message });
      }
    });
  };
  const sendMessage = () => {
    if (chatInput.trim() === "") return;
    addMessage(myName, chatInput);
    broadcastMessage({ sender: myName, text: chatInput }, myPeerId);
    setChatInput("");
  };

  return (
    <div className="app">
      <h1>Peer-to-Peer Chat</h1>
      <p>
        Hi {myName} <br />
        my Peer ID: <strong>{myPeerId}</strong>
      </p>
      <p>number of players: {playerCount}</p>

      <div className="chat">
        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.sender === myName ? "outgoing" : "incoming"
              }`}
            >
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
        <button onClick={() => sendBroadcast(chatInput)}>Send Broadcast</button>
        <button onClick={() => sendPrivate(selectedPeer, chatInput)}>
          Send Private
        </button>
      </div>

      <h2>Select Receiver</h2>
      <select
        onChange={(e) => setSelectedPeer(e.target.value)}
        value={selectedPeer}
      >
        <option value="">All</option>
        {Object.entries(connListRef.current).map(
          ([peerId, peerObj]) =>
            peerId !== myPeerId && (
              <option key={peerId} value={peerId}>
                {peerObj.name} ({peerId})
              </option>
            )
        )}
      </select>

      <h2>Connected Players</h2>
      {Object.entries(connListRef.current).map(([peerId, obj]) => (
        <div key={peerId}>
          {obj.name} ({peerId})
        </div>
      ))}
    </div>
  );
}
CreateGame.propTypes = {
  myName: PropTypes.string.isRequired,
};
