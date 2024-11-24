import { useState } from "react";
import CreateGame from "./CreateGame";
import JoinGame from "./JoinGame";

export default function TestLobby() {
    const [activeComponent, setActiveComponent] = useState(null);

    const handleButtonClick = (component) => {
        setActiveComponent(component);
    };

    return (
        <div>
            <button onClick={() => handleButtonClick('create')}>Create</button>
            <button onClick={() => handleButtonClick('join')}>Join</button>

            {activeComponent === 'create' && <CreateGame />}
            {activeComponent === 'join' && <JoinGame />}
        </div>
    );
}