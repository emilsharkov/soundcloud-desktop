import { useAudioContext } from '@/context/AudioContext';
import { JSX } from 'react';
import { Play } from './Play';
import { Repeat } from './Repeat';
import { Seeker } from './Seeker';
import { Shuffle } from './Shuffle';
import { Skip } from './Skip';
import { Volume } from './Volume';

const MusicPlayer = (): JSX.Element => {
    const { audioRef } = useAudioContext();

    return (
        <div className='w-full h-10'>
            <audio loop ref={audioRef} />
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
    );
};

export { MusicPlayer };
