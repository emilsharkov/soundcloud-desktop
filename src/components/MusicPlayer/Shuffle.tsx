import { useAudioContext } from '@/context/audio/AudioContext';
import { Shuffle as ShuffleIcon } from 'lucide-react';

const Shuffle = () => {
    const { shuffled, toggleShuffle } = useAudioContext();

    const handleShuffle = () => {
        console.log('Shuffle clicked, current state:', shuffled);
        toggleShuffle();
        console.log('Shuffle toggled, new state should be:', !shuffled);
    };

    return (
        <ShuffleIcon
            className='size-4 text-secondary cursor-pointer'
            color={shuffled ? '#ff4900' : 'white'}
            onClick={handleShuffle}
        />
    );
};

export { Shuffle };
