import { useAudio } from '@/providers/AudioProvider';
import { SkipBack, SkipForward } from 'lucide-react';

interface SkipProps {
    direction: 'forward' | 'backward';
}

const Skip = (props: SkipProps) => {
    const { direction } = props;
    const { selectedTrackId, next, prev } = useAudio();
    const Icon = direction === 'forward' ? SkipForward : SkipBack;

    return (
        <Icon
            className='size-5 text-secondary fill-secondary'
            style={{
                cursor: selectedTrackId === null ? 'not-allowed' : 'pointer',
                opacity: selectedTrackId === null ? 0.5 : 1,
            }}
            onClick={() => {
                if (direction === 'forward') {
                    next();
                } else {
                    prev();
                }
            }}
        />
    );
};

export { Skip };
