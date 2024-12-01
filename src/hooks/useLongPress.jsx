import { useRef } from "react";

const useLongPress = (callback, ms = 500) => {
    const pressTimer = useRef(null);

    const startPress = () => {
        pressTimer.current = setTimeout(callback, ms);
    };

    const endPress = () => {
        clearTimeout(pressTimer.current);
    };

    return {
        onMouseDown: startPress,
        onMouseUp: endPress,
        onMouseLeave: endPress,
        onTouchStart: startPress,
        onTouchEnd: endPress,
    };
};

export default useLongPress;
