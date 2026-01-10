import { Repeat as RepeatType } from '@/core/audio/types';
import { useAudio } from '@/providers/AudioProvider';
import { Repeat1Icon, RepeatIcon } from 'lucide-react';

const Repeat = () => {
    const { repeat, setRepeat } = useAudio();

    const Icon =
        repeat === 'none'
            ? RepeatIcon
            : repeat === 'song'
              ? Repeat1Icon
              : RepeatIcon;

    const handleRepeat = () => {
        let newRepeat: RepeatType;
        switch (repeat) {
            case 'none':
                newRepeat = 'songs';
                break;
            case 'songs':
                newRepeat = 'song';
                break;
            case 'song':
                newRepeat = 'none';
                break;
        }
        setRepeat(newRepeat);
    };

    return (
        <Icon
            className='size-4 text-secondary cursor-pointer'
            color={repeat === 'none' ? 'white' : '#ff4900'}
            onClick={handleRepeat}
        />
    );
};

export { Repeat };
