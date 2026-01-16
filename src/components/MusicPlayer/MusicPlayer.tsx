import { useAudio } from '@/providers/AudioProvider';
import { useState } from 'react';
import { FullscreenPlayer } from './FullScreenPlayer';
import { Play } from './Play';
import { Repeat } from './Repeat';
import { Seeker } from './Seeker';
import { Shuffle } from './Shuffle';
import { Skip } from './Skip';

const MusicPlayer = (): React.ReactNode => {
    const { audioRef, trackMediaMetadata } = useAudio();
    const { title, artist, artwork } = trackMediaMetadata ?? {};
    const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);

    const handlePlayerClick = () => {
        setIsFullScreenOpen(true);
    };

    const handleCloseFullScreen = () => {
        setIsFullScreenOpen(false);
    };

    return (
        <>
            <div className='relative w-full h-14'>
                <audio ref={audioRef} />
                <button
                    type='button'
                    className='absolute inset-0 bg-search transition-colors hover:bg-search/80 cursor-pointer'
                    onClick={handlePlayerClick}
                    aria-label='Open fullscreen player'
                />
                <div className='relative z-10 w-full h-full flex flex-row items-center justify-between px-4 gap-6 pointer-events-none'>
                    <div className='flex flex-row items-center gap-3 min-w-0 w-[260px]'>
                        {artwork ? (
                            <div className='hidden sm:flex size-10 rounded-md bg-black/40 overflow-hidden items-center justify-center text-xs text-white shrink-0'>
                                <img
                                    src={artwork}
                                    alt=''
                                    className='size-full object-cover'
                                />
                            </div>
                        ) : null}
                        <div className='hidden sm:flex flex-col min-w-0'>
                            <span className='text-sm text-white truncate'>
                                {title}
                            </span>
                            <span className='text-xs text-gray-400 truncate'>
                                {artist}
                            </span>
                        </div>
                    </div>
                    <div className='flex flex-col items-center justify-center flex-1 pointer-events-auto'>
                        <div className='flex flex-row items-center justify-center gap-4'>
                            <Shuffle />
                            <Skip direction='backward' />
                            <Play />
                            <Skip direction='forward' />
                            <Repeat />
                        </div>
                        <div className='flex flex-row items-center justify-center gap-3'>
                            <Seeker />
                        </div>
                    </div>
                    <div className='w-[260px]' aria-hidden='true' />
                </div>
            </div>
            <FullscreenPlayer
                isOpen={isFullScreenOpen}
                onClose={handleCloseFullScreen}
            />
        </>
    );
};

export { MusicPlayer };
