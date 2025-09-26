import { useAudioContext } from '@/context/audio/AudioContext';
import { PauseIcon, PlayIcon } from 'lucide-react';

const Play = () => {
    const { paused, setPaused, selectedTrackId } = useAudioContext();
    const Icon = paused ? PlayIcon : PauseIcon;

    const handlePlayPause = () => {
        if (selectedTrackId === null) return;
        setPaused(!paused);
    };

    return (
        <Icon
            className='size-6 text-secondary fill-secondary'
            style={{
                opacity: selectedTrackId === null ? 0.5 : 1,
                cursor: selectedTrackId === null ? 'not-allowed' : 'pointer',
            }}
            onClick={handlePlayPause}
        />
    );
};

export { Play };
