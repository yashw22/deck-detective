import React from 'react';
import styles from './PropertyCard.module.css';

export default function PropertyCard(props) {
    let icon = "";
    switch (props.type) {
        case "Axe":
            icon = "🪓";
            break;
        case "Blaster":
            icon = "🔫";
            break;
        case "Crossbow":
            icon = "🏹";
            break;
        default:
            icon = "❓"; // Fallback icon
    }

    const renderIcons = () => {
        // Generate an array of icons based on `props.number`
        const icons = [];
        for (let i = 0; i < props.number; i++) {
            icons.push(
                <span key={i} className={styles.icon}>
                    {icon}
                </span>
            );
        }
        return (
            <div
                className={
                    props.number === 3 ? styles.diagonal : styles.icons
                }
            >
                {icons}
            </div>
        );
    };
    
    return (
        <div
            className={styles.cardbody}
            style={{
                backgroundColor:
                    props.color === "red"
                        ? "#ffcccc"
                        : props.color === "green"
                        ? "#ccffcc"
                        : props.color === "blue"
                        ? "#cce5ff"
                        : props.color === "yellow"
                        ? "#FFFF00"
                        : "white", // Fallback to white
            }}
        >
            {renderIcons()}
        </div>
    );
}
