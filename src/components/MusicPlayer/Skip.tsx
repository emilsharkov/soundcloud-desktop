import { SkipBack, SkipForward } from 'lucide-react';

interface SkipProps {
    direction: 'forward' | 'backward';
}

const Skip = (props: SkipProps) => {
    const { direction } = props;
    const Icon = direction === 'forward' ? SkipForward : SkipBack;

    return <Icon className='size-5 text-secondary fill-secondary' />;
};

export { Skip };
