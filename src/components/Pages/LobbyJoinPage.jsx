import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Peer from "peerjs";
import styles from './LobbyJoinPage.module.css';


import GamePage from "./GamePage";

export default function LobbyJoinPage({ myName }) {
  const myPeerRef = useRef(null);
  //   const [myPeerId, setMyPeerId] = useState();

  const [hostPeerId, setHostPeerId] = useState("");
  const hostConnRef = useRef(null);
  const [playerCount, setPlayerCount] = useState(0);
  const connListRef = useRef({});
  //   const [selectedPeer, setSelectedPeer] = useState("");

  const [beginGame, setBeginGame] = useState(false);
  const gamePageRef = useRef();
  const [boardInfo, setBoardInfo] = useState({});

  useEffect(() => {
    const newPeer = new Peer();
    // const newPeer = new Peer({
    //   host: "peerjs-server-d8ry.onrender.com",
    //   path: "/deckdetective",
    //   secure: true,
    // });
    myPeerRef.current = newPeer;

    newPeer.on("open", (id) => {
      console.log(id);
      //   setMyPeerId(id);
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

    newConn.on("data", (packet) => {
      if (packet.type === "newConnData") {
        connListRef.current[packet.peerId] = { name: packet.peerName };
        setPlayerCount((p) => p + 1);
      } else if (packet.type === "broadcast") {
        if (packet.data.info === "beginGame") {
          setBoardInfo(packet.data.boardInfo);
          setBeginGame(true);
        }
        else if (packet.data.info === "responseSearchCard") {
          gamePageRef.current.setResponse(packet.data)
        }

      } else if (packet.type === "private") {
        // alert(
        //   `**PRIVATE** ${connListRef.current[packet.sender].name} says: ${
        //     packet.data
        //   }`
        // );
        // if (packet.data.info === "reqSearchCard") {
        //   console.log()
        // }
      }
    });
  };

  const sendBroadcast = (data) => {
    hostConnRef.current.send({ type: "broadcast", data: data });
  };
  // const sendPrivate = (receiverPeerId, data) => {
  //   hostConnRef.current.send({
  //     type: "private",
  //     receiver: receiverPeerId,
  //     data: data,
  //   });
  // };

  if (beginGame) {
    return (
      <GamePage
        ref={gamePageRef}
        myPeerId={myPeerRef.current.id}
        myName={myName}
        // playerCount={playerCount}
        sendBroadcast={sendBroadcast}
        // sendPrivate={sendPrivate}
        playerList={connListRef.current}
        boardInfo={boardInfo}
      />
    );
  }

  return (
    <div className={styles.container}>
      <p className={styles.title}>
        <span className={styles.detectiveLabel}>Detective</span>{" "}
        <span className={styles.playerName}>{myName}</span>
      </p>
      {!hostConnRef.current && (
        <div className={styles.connection}>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter Game ID to connect"
            value={hostPeerId}
            onChange={(e) => setHostPeerId(e.target.value)}
          />
          <button className={styles.connectButton} onClick={connectToPeer}>
            Connect
          </button>
        </div>
      )}

      <h2 className={styles.heading}>Lobby</h2>
      <p className={styles.info}>Connected Players: {playerCount}</p>
      <div className={styles.playersContainer}>
        {Object.entries(connListRef.current).map(([peerId, obj]) => (
          <div key={peerId} className={styles.playerBox}>
            <span>{obj.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

LobbyJoinPage.propTypes = {
  myName: PropTypes.string.isRequired,
};
