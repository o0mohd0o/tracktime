import React, { useState, useEffect, useRef } from 'react';
import TimerDisplay from './TimerDisplay';
import ProgressBar from './ProgressBar';
import Controls from './Controls';
import AudioComponent from './AudioComponent';

const Timer = () => {
    const workTime = 45 * 60; // 45 minutes in seconds
    const breakTime = 15 * 60; // 15 minutes in seconds
    const [isWorking, setIsWorking] = useState(true);
    const [remainingTime, setRemainingTime] = useState(workTime);
    const [isActive, setIsActive] = useState(false);
    const [pausedTime, setPausedTime] = useState(0);
    const timerId = useRef(null);
    const workAudioRef = useRef(new Audio("/sounds/work-sound.mp3"));
    const breakAudioRef = useRef(new Audio("/sounds/break-sound.mp3"));
    const [muted, setMuted] = useState(false);


    const toggleActive = () => {
        if (!isActive) {
            // Starting or resuming the timer
            setIsActive(true);

            // Calculate the correct remaining time based on whether it's work or break session
            const adjustedRemainingTime = isWorking ? workTime : breakTime;
            const startTime = Date.now() - (adjustedRemainingTime - remainingTime) * 1000;

            timerId.current = setInterval(() => {
                const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                const timeLeft = adjustedRemainingTime - elapsedTime;

                if (timeLeft <= 0) {
                    clearInterval(timerId.current); // Clear the timer
                    const nextSessionIsWork = !isWorking; // Determine the next session type
                    setIsWorking(nextSessionIsWork); // Toggle between work and break
                    setRemainingTime(nextSessionIsWork ? workTime : breakTime); // Reset to full time for the next session
                    setIsActive(false); // Stop the timer
                    setPausedTime(0); // Reset paused time for the next start

                    // Trigger notification for the session switch
                    showNotification(nextSessionIsWork ? "Back to work!" : "Time for a break!");

                    // Handle audio change for the session switch
                    if (!muted) {
                        // Ensure correct sound plays at the start of a session
                        nextSessionIsWork ? workAudioRef.current.play() : breakAudioRef.current.play();
                    }
                } else {
                    setRemainingTime(timeLeft); // Update the remaining time
                }
            }, 1000);

            // Handling audio for starting or resuming session
            if (!muted) {
                if (isWorking) {
                    workAudioRef.current.play();
                } else {
                    // Ensure break sound plays at the start of a break session
                    breakAudioRef.current.currentTime = 0;  // Resetting the audio to start
                    breakAudioRef.current.play();
                }
            }

            // Show notification when starting or resuming the session
            showNotification(isWorking ? "Work started!" : "Break started!");

        } else {
            // Pausing the timer
            setIsActive(false);
            clearInterval(timerId.current); // Clear the existing interval

            // Show notification when pausing work or break
            showNotification(isWorking ? "Work paused!" : "Break paused!");

            // Capture the time at which the timer was paused to resume accurately later
            setPausedTime(remainingTime);

            pauseAudio(); // Pause audio as well
        }
    };



    useEffect(() => {
        if (isActive) {
            // Define a start time for the session based on the current remaining time
            const startTime = Date.now() - (isWorking ? (workTime - remainingTime) : (breakTime - remainingTime)) * 1000;

            timerId.current = setInterval(() => {
                const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                const timeLeft = (isWorking ? workTime : breakTime) - elapsedTime;

                if (timeLeft <= 0) {
                    clearInterval(timerId.current);
                    const nextSessionIsWork = !isWorking;
                    setIsWorking(nextSessionIsWork);
                    setRemainingTime(nextSessionIsWork ? workTime : breakTime);
                    setIsActive(false);
                    setPausedTime(0);

                    showNotification(nextSessionIsWork ? "Back to work!" : "Time for a break!");

                    if (!muted) {
                        // Ensure break sound plays at the start of a break session
                        isWorking ? workAudioRef.current.play() : breakAudioRef.current.play();
                    }
                } else {
                    setRemainingTime(timeLeft);
                }
            }, 1000);
        } else {
            clearInterval(timerId.current);
        }

        return () => clearInterval(timerId.current);
    }, [isActive, isWorking, remainingTime, workTime, breakTime, muted]); // Ensure dependencies are correctly listed



    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        if (muted) {
            pauseAudio();  // This should pause both work and break audio
        } else {
            // Only play audio if the timer is active
            if (isActive) {
                isWorking ? workAudioRef.current.play() : breakAudioRef.current.play();
            }
        }
    }, [muted, isActive, isWorking]);

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
        clearInterval(timerId.current); // Stop any ongoing interval

        const nextSessionIsWork = !isWorking; // Determine the next session type

        setIsWorking(nextSessionIsWork); // Toggle between working and break

        // Set the correct time for the new session
        setRemainingTime(nextSessionIsWork ? workTime : breakTime);

        setIsActive(false); // Stop and reset the timer
        setPausedTime(0); // Reset the paused time for a fresh start

        // Do not automatically play break sound when skipping to break session
        if (!muted) {
            if (nextSessionIsWork) {
                // If skipping to a work session, ensure break sound is paused
                breakAudioRef.current.pause();
            } else {
                // If skipping to a break session, ensure work sound is paused
                workAudioRef.current.pause();
            }
        }
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
                <TimerDisplay remainingTime={remainingTime} />
                <ProgressBar remainingTime={remainingTime} isWorking={isWorking} workTime={workTime} breakTime={breakTime} />
                <Controls
                    isActive={isActive}
                    toggleActive={toggleActive}
                    skipSession={skipSession}
                    toggleMute={toggleMute}
                    isMuted={muted}
                />
                <AudioComponent
                    isActive={isActive}
                    isWorking={isWorking}
                    muted={muted}
                    workAudioRef={workAudioRef}
                    breakAudioRef={breakAudioRef}
                />
            </div>
        </div>
    );
};

export default Timer;
