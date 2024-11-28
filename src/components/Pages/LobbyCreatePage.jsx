import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Peer from "peerjs";
import styles from "./LobbyCreatePage.module.css";

import GamePage from "./GamePage";
import {
  distributeSearchCards,
  distributeWeaponCards,
} from "../../lib/gameUtils";
import { maxPlayers, minPlayers } from "../../lib/gameConstants";



export default function LobbyCreatePage({ myName }) {
  const myPeerRef = useRef(null);
  const myPeerNameRef = useRef(myName);
  const [myPeerId, setMyPeerId] = useState();

  const [playerCount, setPlayerCount] = useState(0);
  const connListRef = useRef({});
  //   const [selectedPeer, setSelectedPeer] = useState("");

  const beginGameRef = useRef(false);
  const gamePageRef = useRef();
  const [boardInfo, setBoardInfo] = useState({});

  useEffect(() => {
    // const myPeer = new Peer();
    const myPeer = new Peer({
      host: "peerjs-server-d8ry.onrender.com",
      path: "/deckdetective",
      secure: true,
    });
    myPeerRef.current = myPeer;

    myPeer.on("open", (id) => {
      setMyPeerId(id);
      setPlayerCount(1);
    });

    myPeer.on("connection", (newConn) => {
      if (
        !beginGameRef.current &&
        Object.keys(connListRef.current).length < maxPlayers - 1
      ) {
        const { peerName } = newConn.metadata;
        connListRef.current[newConn.peer] = { conn: newConn, name: peerName };
        setPlayerCount((p) => p + 1);

        broadcastNewConnection(newConn.peer, peerName);
        newConn.on("open", () => {
          shareAllConnections(newConn);
        });

        newConn.on("data", (packet) => {
          if (packet.type === "broadcast") {
            forwardBroadcast(newConn.peer, packet.data);
            processData(newConn.peer, packet);
          } else if (packet.type === "private") {
            if (packet.receiver == myPeerRef.current.id)
              processData(newConn.peer, packet);
            else forwardPrivate(newConn.peer, packet.receiver, packet.data);
          }
        });
      } else newConn.close();
    });

    return () => {
      // New code to gracefully close connection, not yet tested
      //   Object.values(connListRef.current).forEach((conn) => {
      //     conn.send({
      //       type: "closeConn",
      //     });
      //     conn.close();
      //   });
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
  };
  const forwardPrivate = (senderPeerId, receiverPeerId, data) => {
    connListRef.current[receiverPeerId].conn.send({
      type: "private",
      sender: senderPeerId,
      data: data,
    });
  };

  const processData = (senderPeerId, packet) => {
    if (packet.type === "broadcast") {
      if (packet.data.info === "responseSearchCard") {
        gamePageRef.current.setResponse(packet.data);
      }
    } else if (packet.type === "private") {
      alert(
        `**PRIVATE** ${connListRef.current[senderPeerId].name} says: ${packet.data}`
      );
    }
  };
  const sendBroadcast = (data) => {
    forwardBroadcast(myPeerRef.current.id, data);
  };
  // const sendPrivate = (receiverPeerId, data) => {
  //   forwardPrivate(myPeerRef.current.id, receiverPeerId, data);
  // };

  const handleBeginGame = () => {
    if (playerCount >= minPlayers) {
      const [playerWeaponCards, commonWeaponCards, resultCard] =
        distributeWeaponCards(playerCount);

      var [playerSearchCards, searchDeck] = distributeSearchCards(playerCount);

      var newBoard = {
        searchDeck: searchDeck,
        usedDeck: [],
        commonCards: commonWeaponCards,
        resultCard: resultCard,
        [myPeerId]: {
          name: myName,
          weaponCards: playerWeaponCards[playerCount - 1],
          searchCards: playerSearchCards[playerCount - 1],
        },
      };
      Object.entries(connListRef.current).map(([peerId, peerObj], idx) => {
        newBoard[peerId] = {
          name: peerObj.name,
          weaponCards: playerWeaponCards[idx],
          searchCards: playerSearchCards[idx],
        };
      });

      // console.log(newBoard);
      // console.log(connListRef.current);
      beginGameRef.current = true;
      // setBeginGame(true);
      setBoardInfo(newBoard);
      sendBroadcast({ info: "beginGame", boardInfo: newBoard });
    }
  };

  const handleRemovePlayer = (peerId) => {
    sendBroadcast({
      info: "lobbyRemovePlayer",
      peerId: peerId,
    });
    connListRef.current[peerId].conn.close();
    delete connListRef.current[peerId];
    setPlayerCount((p) => p - 1);
  };

  if (beginGameRef.current) {
    return (
      <GamePage
        ref={gamePageRef}
        myPeerId={myPeerId}
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
    <div className={styles.createpage}>
      <p className={styles.title}>
        <span className={styles.detectiveLabel}>Detective</span>{" "}
        <span className={styles.playerName}>{myName}</span>
      </p>
      <p>
        Game ID: <strong>{myPeerId}</strong>
        {myPeerId && (
          <button
            className={styles.copyButton}
            onClick={() => navigator.clipboard.writeText(myPeerId)}
            aria-label="Copy Game ID"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="16px"
              height="16px"
            >
              <path d="M8 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8zm0 2h8v12H8V4zm-2 4H4v12a2 2 0 0 0 2 2h8v-2H6V8z" />
            </svg>
          </button>
        )}
      </p>

      {playerCount >= minPlayers && (
        <button className={styles.button} onClick={handleBeginGame}>
          Begin Game
        </button>
      )}

      <h1 className={styles.heading}>Lobby</h1>
      <div className={styles.playersContainer}>
        <p>Connected Players: {playerCount}</p>
        {Object.entries(connListRef.current).map(([peerId, obj]) => (
          <div key={peerId} className={styles.playerBox}>
            <span>{obj.name}</span>
            <button
              className={styles.removeButton}
              onClick={() => handleRemovePlayer(peerId)}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

LobbyCreatePage.propTypes = {
  myName: PropTypes.string.isRequired,
};
