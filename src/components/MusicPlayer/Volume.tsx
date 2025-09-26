import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useAudioContext } from '@/context/audio/AudioContext';
import { cn } from '@/lib/utils';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { Volume2 } from 'lucide-react';
import { useState } from 'react';

const Volume = () => {
    const { volume, setVolume } = useAudioContext();
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const onMouseHandle = (isHovered: boolean) => {
        setIsHovered(isHovered);
    };

    const onVolumeChange = (value: number[]) => {
        setVolume(value[0]);
    };

    return (
        <Popover open={isHovered} onOpenChange={setIsHovered}>
            <PopoverTrigger
                onClick={() => setIsHovered(!isHovered)}
                onMouseEnter={() => onMouseHandle(true)}
                onMouseLeave={() => onMouseHandle(false)}
            >
                <Volume2 className='size-4 text-secondary fill-secondary' />
            </PopoverTrigger>
            <PopoverContent
                sideOffset={0}
                onMouseEnter={() => onMouseHandle(true)}
                onMouseLeave={() => onMouseHandle(false)}
                className='w-10 h-40 bg-primary border-gray-500'
                align='center'
            >
                <div className='flex w-full h-full max-w-full max-h-full bg-white'>
                    <SliderPrimitive.Root
                        data-slot='slider'
                        value={[volume]}
                        min={0}
                        max={1}
                        orientation='vertical'
                        onValueChange={onVolumeChange}
                        step={0.01}
                        className={cn(
                            'bg-tertiary relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
                            'flex w-full h-full min-h-auto!'
                        )}
                    >
                        <SliderPrimitive.Track
                            data-slot='slider-track'
                            className={cn(
                                'bg-tertiary relative grow overflow-hidden data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5'
                            )}
                        >
                            <SliderPrimitive.Range
                                data-slot='slider-range'
                                className={cn(
                                    'rounded-full bg-white absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full'
                                )}
                            />
                        </SliderPrimitive.Track>
                        <SliderPrimitive.Thumb
                            data-slot='slider-thumb'
                            className='border-tertiary border bg-background block size-4 shrink-0 rounded-full shadow-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50'
                        />
                    </SliderPrimitive.Root>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export { Volume };
