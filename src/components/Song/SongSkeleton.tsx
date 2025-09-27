import { Skeleton } from '../ui/skeleton';

const SongSkeleton = () => {
    return (
        <div className='flex flex-row w-full items-center gap-4'>
            <Skeleton className='w-[125px] h-[125px] rounded-lg' />
            <div className='flex flex-col flex-1 gap-3'>
                <div className='flex flex-col gap-2'>
                    <Skeleton className='w-24 h-5 rounded-sm' />
                    <Skeleton className='w-30 h-5 rounded-sm' />
                </div>
                <Skeleton className='w-full h-12' />
            </div>
        </div>
    );
};

export { SongSkeleton };
