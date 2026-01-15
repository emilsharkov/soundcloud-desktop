import { useWaveform } from '@/hooks/useWaveform';
import { Waveform } from '@/types/schemas/response/local';
import { useDraggable } from '@dnd-kit/core';
import { WaveformBar } from './WaveformBar';

interface FullscreenPlayerStageProps {
    artwork?: string;
    onClose: () => void;
    width: number;
    percentageCompleted: number;
    waveform: Waveform;
}

const FullscreenPlayerStage = (props: FullscreenPlayerStageProps) => {
    const { artwork, onClose, percentageCompleted, width, waveform } = props;
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: 'fullscreen-player',
    });
    const { ref, samples } = useWaveform(waveform);
    const sampleIndex = Math.floor(percentageCompleted * (samples.length - 1));
    const position = Math.floor(percentageCompleted * width * -1);

    const style = {
        backgroundImage: `url(${artwork})`,
        width: '200vw',
        transform: `translate3d(${position}px, 0, 0)`,
    };

    return (
        <div
            ref={setNodeRef}
            className='fixed top-0 left-0 h-full z-50 cursor-grab active:cursor-grabbing bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center'
            style={style}
            {...listeners}
            {...attributes}
            onClick={!isDragging ? onClose : undefined}
        >
            <div className='absolute left-[50vw] h-10 w-[100vw]'>
                <WaveformBar
                    ref={ref}
                    samples={samples}
                    sampleIndex={sampleIndex}
                />
            </div>
        </div>
    );
};

export { FullscreenPlayerStage };
