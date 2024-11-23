import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

export default function JoinGame() {
  const myPeerRef = useRef(null);
  //   const connList = useRef([]);
  const [myPeerId, setMyPeerId] = useState();
  const [hostPeerId, setHostPeerId] = useState("");
  const hostConnRef = useRef(null);

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
      setMyPeerId(id);
    });
    return () => {
      newPeer.destroy();
    };
  }, []);

  const connectToPeer = () => {
    const newConn = myPeerRef.current.connect(hostPeerId);
    hostConnRef.current = newConn;

    newConn.on("open", () => {
      console.log("Connection established");
    });

    // newConn.on("data", handleIncomingMessage);
  };

  return (
    <div className="app">
      <h1>Peer-to-Peer Chat</h1>
      <p>
        my Peer ID: <strong>{myPeerId}</strong>
      </p>

      <div className="connection">
        <input
          type="text"
          placeholder="Enter Peer ID to connect"
          value={hostPeerId}
          onChange={(e) => setHostPeerId(e.target.value)}
        />
        <button onClick={connectToPeer}>Connect</button>
      </div>
    </div>
  );
}
