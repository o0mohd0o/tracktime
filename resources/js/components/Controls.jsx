const Controls = ({ isActive, toggleActive, skipSession, toggleMute, isMuted }) => {
    return (
        <div className="mb-4">
            <button onClick={toggleActive} className={`btn btn-lg btn-block mb-3 ${isActive ? "btn-danger" : "btn-success"}`}>
                {isActive ? "Pause" : "Start"}
            </button>
            <button onClick={skipSession} className="btn btn-primary btn-lg">
                Skip Session
            </button>
            <button onClick={toggleMute} className="pauseSound">
                <i className={`fa-solid ${isMuted ? "fa-play" : "fa-pause"}`}></i>
            </button>
        </div>
    );
};
export default Controls;
