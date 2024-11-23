import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

const maxPlayers = 5;

export default function CreateGame() {
  const myPeerRef = useRef(null);
  const [myPeerId, setMyPeerId] = useState();
  const [connList, setConnList] = useState([]);
  const [count, setCount] = useState(0);

  const newConnectionRequest = (newConn) => {
    if (connList.length < maxPlayers) {
      console.log(newConn, connList, maxPlayers);
      setConnList((c) => [...c, newConn]);
      setCount((c) => c + 1);
      newConn.on("data", (data) => {
        console.log(data);
      });
    } else {
      alert("Max player limit reached");
    }
  };

  useEffect(() => {
    const newPeer = new Peer();
    // const newPeer = new Peer({
    //   host: "peerjs-server-d8ry.onrender.com",
    //   path: "/deckdetective",
    //   secure: true,
    // });
    myPeerRef.current = newPeer;

    newPeer.on("open", (id) => {
      console.log("Self node created");
      setCount((c) => c + 1);
      setMyPeerId(id);
    });
    newPeer.on("connection", newConnectionRequest);
    return () => {
      newPeer.destroy();
    };
  }, []);

  return (
    <div className="app">
      <h1>Peer-to-Peer Chat</h1>
      <p>
        my Peer ID: <strong>{myPeerId}</strong>
      </p>
      <p>number of players: {count}</p>

      {connList.map((conn) => (
        <div key={conn.peer}>{conn.peer}</div>
      ))}
    </div>
  );
}
