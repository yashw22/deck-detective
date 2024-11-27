import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Peer from "peerjs";

import GamePage from "./GamePage";
import {
  distributeSearchCards,
  distributeWeaponCards,
} from "../../lib/gameUtils";

const minPlayers = 2,
  maxPlayers = 5;

export default function LobbyCreatePage({ myName }) {
  const myPeerRef = useRef(null);
  const myPeerNameRef = useRef(myName);
  const [myPeerId, setMyPeerId] = useState();

  const [playerCount, setPlayerCount] = useState(0);
  const connListRef = useRef({});
  //   const [selectedPeer, setSelectedPeer] = useState("");

  const [beginGame, setBeginGame] = useState(false);
  const gamePageRef = useRef();
  const [boardInfo, setBoardInfo] = useState({});

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
      if (Object.keys(connListRef.current).length < maxPlayers - 1) {
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

  const handleBeginClick = () => {
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

      setBoardInfo(newBoard);
      sendBroadcast({ info: "beginGame", boardInfo: newBoard });
      setBeginGame(true);
    }
  };

  if (beginGame) {
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
    <div className="app">
      <h1>Lobby</h1>
      <p>
        Detective {myName} <br />
        Joining Game ID: <strong>{myPeerId}</strong>
      </p>
      <p>number of players: {playerCount}</p>

      <button onClick={handleBeginClick}>Begin Game</button>
      <h2>Connected Players</h2>
      {Object.entries(connListRef.current).map(([peerId, obj]) => (
        <div key={peerId}>{obj.name}</div>
      ))}
    </div>
  );
}

LobbyCreatePage.propTypes = {
  myName: PropTypes.string.isRequired,
};
