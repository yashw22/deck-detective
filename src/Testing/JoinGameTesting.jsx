import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Peer from "peerjs";

export default function JoinGame({ myName }) {
  const myPeerRef = useRef(null);
  const [myPeerId, setMyPeerId] = useState();

  const [hostPeerId, setHostPeerId] = useState("");
  const hostConnRef = useRef(null);
  const [playerCount, setPlayerCount] = useState(0);
  const connListRef = useRef({});

  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedPeer, setSelectedPeer] = useState("");

  useEffect(() => {
    const newPeer = new Peer();
    // const newPeer = new Peer({
    //   host: "peerjs-server-d8ry.onrender.com",
    //   path: "/deckdetective",
    //   secure: true,
    // });
    myPeerRef.current = newPeer;

    newPeer.on("open", (id) => {
      setMyPeerId(id);
      setPlayerCount(1);
    });
    return () => {
      // New code to gracefully close connection, not yet tested
      // if (hostConnRef.current) {
      //   hostConnRef.current.send({
      //     type: "closeConn",
      //   });
      //   hostConnRef.current.close();
      // }
      newPeer.destroy();
    };
  }, []);

  const connectToPeer = () => {
    const newConn = myPeerRef.current.connect(hostPeerId, {
      metadata: { peerName: myName },
    });
    hostConnRef.current = newConn;

    // newConn.on("open", () => {
    //   console.log("Connection established");
    // });

    newConn.on("data", (data) => {
      if (data.type === "testChatBox") {
        addMessage(data.msg.sender, data.msg.text);
      } else if (data.type === "newConnData") {
        connListRef.current[data.peerId] = { name: data.peerName };
        setPlayerCount((p) => p + 1);
      } else if (data.type === "broadcast") {
        alert(`${connListRef.current[data.sender].name} says: ${data.data}`);
      } else if (data.type === "private") {
        alert(
          `**PRIVATE** ${connListRef.current[data.sender].name} says: ${
            data.data
          }`
        );
      }
    });
  };

  const sendBroadcast = (data) => {
    hostConnRef.current.send({ type: "broadcast", data: data });
  };
  const sendPrivate = (receiverPeerId, data) => {
    hostConnRef.current.send({
      type: "private",
      receiver: receiverPeerId,
      data: data,
    });
  };

  const addMessage = (name, message) => {
    setMessages((m) => [...m, { sender: name, text: message }]);
  };
  const sendMessage = () => {
    if (chatInput.trim() === "") return;
    addMessage(myName, chatInput);
    hostConnRef.current.send({ type: "testChatBox", msg: chatInput });
    setChatInput("");
  };

  return (
    <div>
      <h1>Peer-to-Peer Chat</h1>
      <p>
        Hi {myName}
        <br />
        my Peer ID: <strong>{myPeerId}</strong>
      </p>
      <p>number of players: {playerCount}</p>

      {!hostConnRef.current && (
        <div className="connection">
          <input
            type="text"
            placeholder="Enter Peer ID to connect"
            value={hostPeerId}
            onChange={(e) => setHostPeerId(e.target.value)}
          />
          <button onClick={connectToPeer}>Connect</button>
        </div>
      )}

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
JoinGame.propTypes = {
  myName: PropTypes.string.isRequired,
};
