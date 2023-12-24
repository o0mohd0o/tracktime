const AudioComponent = ({ isWorking, muted, workAudioRef, breakAudioRef }) => {
    // Use effect to manage the audio playback when isWorking or muted changes
    useEffect(() => {
        if (!muted) {
            if (isWorking) {
                workAudioRef.current.play();
            } else {
                breakAudioRef.current.play();
            }
        } else {
            workAudioRef.current.pause();
            breakAudioRef.current.pause();
        }
    }, [isWorking, muted]);

    return null; // This component doesn't render anything
};
