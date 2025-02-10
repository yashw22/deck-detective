import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Peer from "peerjs";
import styles from "./LobbyJoinPage.module.css";

import GamePageNew from "./GamePageNew";

import { peerConfig } from "../../config/peerConfig";
import { generateString } from "../../utils/helpers";

export default function LobbyJoinPage({ myName }) {
  const myPeerRef = useRef(null);

  const [hostPeerId, setHostPeerId] = useState("");
  const hostConnRef = useRef(null);
  const [playerCount, setPlayerCount] = useState(0);
  const connListRef = useRef({});

  const [beginGame, setBeginGame] = useState(false);
  const gamePageRef = useRef();
  const [boardInfo, setBoardInfo] = useState({});

  const [restartStatus, setRestartStatus] = useState("");
  useEffect(() => {
    const timeout = setTimeout(() => {
      setRestartStatus("Restarting server, may take up to 2 minutes");
    }, 10000); //15 sec

    return () => clearTimeout(timeout);
  }, []);

  const dotsRef = useRef(null);
  useEffect(() => {
    if (!playerCount) {
      let dotsCount = 0;
      const interval = setInterval(() => {
        if (dotsRef.current) {
          dotsCount = (dotsCount % 5) + 1;
          dotsRef.current.innerText = ".".repeat(dotsCount);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [playerCount]);

  useEffect(() => {
    const newPeer = new Peer(generateString(), peerConfig);
    myPeerRef.current = newPeer;

    newPeer.on("open", () => {
      // newPeer.on("open", (id) => {
      // console.log(id);
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
        if (packet.data.info === "lobbyRemovePlayer") {
          if (packet.data.peerId === myPeerRef.current.id) {
            connListRef.current = {};
            setPlayerCount(1);
            hostConnRef.current = null;
          } else {
            delete connListRef.current[packet.data.peerId];
            setPlayerCount((p) => p - 1);
          }
        } else if (packet.data.info === "beginGame") {
          setBoardInfo(packet.data.boardInfo);
          setBeginGame(true);
        } else if (packet.data.info === "searchResponse") {
          gamePageRef.current.setResponse(packet.data);
        } else if (packet.data.info === "searchReplaceResponse") {
          gamePageRef.current.setResponse(packet.data);
        } else if (packet.data.info === "guessedHiddenCard") {
          gamePageRef.current.setResponse(packet.data);
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
      <GamePageNew
        ref={gamePageRef}
        myPeerId={myPeerRef.current.id}
        sendBroadcast={sendBroadcast}
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
      {!playerCount && (
        <div>
          Connecting to server{" "}
          <span
            ref={dotsRef}
            style={{
              width: "1.8em",
              textAlign: "left",
              display: "inline-block",
            }}
          ></span>
          <div>{restartStatus}</div>
        </div>
      )}
      {playerCount !== 0 && !hostConnRef.current && (
        <div className={styles.connection}>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter Game ID to connect"
            value={hostPeerId}
            onChange={(e) => setHostPeerId(e.target.value.toLowerCase())}
          />
          <button className={styles.connectButton} onClick={connectToPeer}>
            Connect
          </button>
        </div>
      )}
      {hostConnRef.current && (
        <>
          <h2 className={styles.heading}>Lobby</h2>
          <p className={styles.info}>Players in Lobby: {playerCount}</p>
          <div className={styles.playersContainer}>
            {Object.entries(connListRef.current).map(([peerId, obj]) => (
              <div key={peerId} className={styles.playerBox}>
                <span>{obj.name}</span>
                {peerId === hostConnRef.current.peer && <span>👑</span>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

LobbyJoinPage.propTypes = {
  myName: PropTypes.string.isRequired,
};
