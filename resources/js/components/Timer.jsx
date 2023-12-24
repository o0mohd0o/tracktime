import React, { useState, useEffect, useRef } from 'react';

const Timer = () => {
    const workTime = 45 * 60; // 45 minutes in seconds
    const breakTime = 15 * 60; // 15 minutes in seconds
    const [isWorking, setIsWorking] = useState(true);
    const [remainingTime, setRemainingTime] = useState(workTime);
    const [isActive, setIsActive] = useState(false);
    const [pausedTime, setPausedTime] = useState(0);
    const timerId = useRef(null);
    const workAudioRef = useRef(null);
    const breakAudioRef = useRef(null);
    const [muted, setMuted] = useState(false);


    useEffect(() => {
        if (isActive) {
            const startTime = Date.now() - pausedTime;
            timerId.current = setInterval(() => {
                const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                const timeLeft = isWorking ? workTime - elapsedTime : breakTime - elapsedTime;
                if (timeLeft <= 0) {
                    clearInterval(timerId.current);
                    setIsWorking(!isWorking);
                    setRemainingTime(isWorking ? breakTime : workTime);
                    setPausedTime(0);
                    setIsActive(false);
                    showNotification(isWorking ? "Time for a break!" : "Back to work!");
                    if (!isWorking) {
                        breakAudioRef.current.play();
                    } else {
                        workAudioRef.current.play();
                    }
                } else {
                    setRemainingTime(timeLeft);
                }
            }, 1000);
        } else {
            clearInterval(timerId.current);
        }

        return () => clearInterval(timerId.current);
    }, [isActive, isWorking, pausedTime]);

    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        if (muted) {
            pauseAudio();
        } else if (isActive) {
            isWorking ? workAudioRef.current.play() : breakAudioRef.current.pause();
        }
    }, [muted, isActive, isWorking]);

    const toggleActive = () => {
        if (!isActive) {
            // Starting or resuming the timer
            setIsActive(true);

            // Show notification when starting work or resuming from pause
            showNotification(isWorking ? "Work started!" : "Break started!");

            // Define a start time for the session based on the remaining time
            const startTime = Date.now() - ((workTime - remainingTime) * 1000);

            timerId.current = setInterval(() => {
                const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                const timeLeft = (isWorking ? workTime : breakTime) - elapsedTime;

                if (timeLeft <= 0) {
                    clearInterval(timerId.current);
                    setIsWorking(!isWorking); // Toggle between work and break
                    setRemainingTime(isWorking ? breakTime : workTime); // Reset to full time for next session
                    setIsActive(false); // Stop the timer
                    setPausedTime(0); // Reset paused time for the next start
                } else {
                    setRemainingTime(timeLeft);
                }
            }, 1000);

            if (!muted) {
                isWorking ? workAudioRef.current.play() : breakAudioRef.current.pause();
            }

        } else {
            // Pausing the timer
            setIsActive(false);
            clearInterval(timerId.current); // Clear the existing interval

            // Show notification when pausing work or break
            showNotification(isWorking ? "Work paused!" : "Break paused!");
            // Capture the time at which the timer was paused to resume accurately later
            setPausedTime((workTime - remainingTime) * 1000);

            pauseAudio(); // Pause audio as well
        }
    };


    // Function to pause the audio
    const pauseAudio = () => {
        workAudioRef.current.pause();
        breakAudioRef.current.pause();
    };

    // Function to mute/unmute the audio
    const toggleMute = () => {
        setMuted(!muted);
    };

    const skipSession = () => {
        clearInterval(timerId.current);
        const newIsWorking = !isWorking;  // Calculate new state before changing any other states
        setIsWorking(newIsWorking);  // Toggle between working and break
        setRemainingTime(newIsWorking ? workTime : breakTime);  // Set correct time for new session
        setIsActive(false);  // Stop the timer
        setPausedTime(0);  // Reset the paused time
    };


    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };


    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    // Function to show notification
    const showNotification = (message) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(message);
        }
    };



    return (
        <div className="bg-light d-flex align-items-center justify-content-center min-vh-100">
            <div className="bg-white p-4 rounded shadow-lg w-50 text-center">
                <h1 className="h3 mb-3">{isWorking ? "Working Time" : "Break Time"}</h1>
                <div className="display-4 font-weight-bold mb-4">{formatTime(remainingTime)}</div>
                <div className="progress mb-3" style={{height: '20px'}}>
                    <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{width: `${(1 - remainingTime / (isWorking ? workTime : breakTime)) * 100}%`}}  // Calculate the elapsed percentage
                        aria-valuenow={remainingTime}
                        aria-valuemin="0"
                        aria-valuemax={isWorking ? workTime : breakTime}
                    ></div>
                </div>

                <div className="mb-4">
                    <button onClick={toggleActive}
                            className={`btn btn-lg btn-block mb-3 ${isActive ? "btn-danger" : "btn-success"}`}>
                        {isActive ? 'Pause' : 'Start'}
                    </button>
                    <button onClick={() => skipSession()} className="btn btn-primary btn-lg">Skip Session</button>
                    <button onClick={toggleMute} className="pauseSound">
                        <i className={`fa-solid ${muted ? "fa-play" : "fa-pause"}`}></i>
                    </button>
                </div>
                <audio ref={workAudioRef} src="/sounds/work-sound.mp3" preload="auto"></audio>
                <audio ref={breakAudioRef} src="/sounds/break-sound.mp3" preload="auto"></audio>
            </div>
        </div>
    );
};

export default Timer;
