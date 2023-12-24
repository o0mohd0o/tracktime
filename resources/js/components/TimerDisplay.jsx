import Controls from "./Controls.jsx";

const TimerDisplay = ({ remainingTime }) => {
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return <div className="display-4 font-weight-bold mb-4">{formatTime(remainingTime)}</div>;
};

export default TimerDisplay;
