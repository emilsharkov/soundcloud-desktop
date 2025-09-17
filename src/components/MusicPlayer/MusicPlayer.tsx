import { useAudioContext } from '@/context/AudioContext';
import { JSX } from 'react';

const MusicPlayer = (): JSX.Element => {
    const { audioRef } = useAudioContext();

    return (
        <div className='w-full'>
            <audio loop ref={audioRef} />
        </div>
    );
};

export { MusicPlayer };
