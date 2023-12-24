const ProgressBar = ({ remainingTime, isWorking, workTime, breakTime }) => {
    const progressPercent = (1 - remainingTime / (isWorking ? workTime : breakTime)) * 100;

    return (
        <div className="progress mb-3" style={{ height: '20px' }}>
            <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${progressPercent}%` }}
                aria-valuenow={remainingTime}
                aria-valuemin="0"
                aria-valuemax="100"
            ></div>
        </div>
    );
};
