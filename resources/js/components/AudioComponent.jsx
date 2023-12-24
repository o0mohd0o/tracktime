import React, { useEffect } from 'react';

const AudioComponent = ({ isActive, isWorking, muted, workAudioRef, breakAudioRef }) => {
    useEffect(() => {
        if (isActive && !muted) {
            // Try to play the audio
            const audio = isWorking ? workAudioRef.current : breakAudioRef.current;
            if (audio) {
                audio.play().catch(e => console.error("Error playing audio:", e));
            }
        }
    }, [isActive, isWorking, muted, workAudioRef, breakAudioRef]); // Now isActive is included as a dependency

    return null;
};

export default AudioComponent;
