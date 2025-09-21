const Seeker = () => {
    return (
        <div className='w-[300px] h-full flex flex-row items-center justify-center gap-2'>
            <p className='text-secondary'>0:00</p>
            <div className='w-full h-1 bg-muted rounded-full'>
                <div className='w-1/2 h-full bg-[#ff4900] rounded-full' />
            </div>
            <p className='text-secondary'>0:00</p>
        </div>
    );
};

export { Seeker };
