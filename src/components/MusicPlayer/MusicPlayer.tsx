import { useAudio } from '@/providers/AudioProvider';
import { useState } from 'react';
import { FullScreenPlayer } from './FullScreenPlayer';
import { Play } from './Play';
import { Repeat } from './Repeat';
import { Seeker } from './Seeker';
import { Shuffle } from './Shuffle';
import { Skip } from './Skip';
import { Volume } from './Volume';

const MusicPlayer = (): React.ReactNode => {
    const { audioRef } = useAudio();
    const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);

    const handlePlayerClick = () => {
        setIsFullScreenOpen(true);
    };

    const handleCloseFullScreen = () => {
        setIsFullScreenOpen(false);
    };

    return (
        <>
            <div
                className='w-full h-10 cursor-pointer'
                onClick={handlePlayerClick}
            >
                <audio ref={audioRef} />
                <div className='w-full h-full flex flex-row items-center justify-center bg-search gap-4'>
                    <div className='flex flex-row items-center justify-center gap-4'>
                        <Skip direction='backward' />
                        <Play />
                        <Skip direction='forward' />
                    </div>
                    <div className='flex flex-row items-center justify-center gap-4'>
                        <Shuffle />
                        <Repeat />
                    </div>
                    <div className='flex flex-row items-center justify-center gap-4'>
                        <Seeker />
                        <Volume />
                    </div>
                </div>
            </div>
            <FullScreenPlayer
                isOpen={isFullScreenOpen}
                onClose={handleCloseFullScreen}
            />
        </>
    );
};

export { MusicPlayer };
