import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCr23zKh63EoSdPnublV5_cDs5CTgbMvFc",
    authDomain: "deck-detective.firebaseapp.com",
    databaseURL: "https://deck-detective-default-rtdb.firebaseio.com",
    projectId: "deck-detective",
    storageBucket: "deck-detective.firebasestorage.app",
    messagingSenderId: "680786228413",
    appId: "1:680786228413:web:c291509194cf584b49f3d4",
    measurementId: "G-L7JW71E4XW"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;