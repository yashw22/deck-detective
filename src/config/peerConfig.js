export const peerConfig = process.env.NODE_ENV === "development" ? {} : {
    host: "peerjs-server-d8ry.onrender.com",
    path: "/deckdetective",
    secure: true,
    config: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302", }],
    },
}