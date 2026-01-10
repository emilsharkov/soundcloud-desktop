import { useAudio } from '@/providers/AudioProvider';
import { Shuffle as ShuffleIcon } from 'lucide-react';

const Shuffle = () => {
    const { shuffled, toggleShuffle } = useAudio();

    const handleShuffle = () => {
        toggleShuffle();
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
