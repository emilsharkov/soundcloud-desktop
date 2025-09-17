import './App.css';
import { Navbar } from './components/Navbar';
import { Song } from './components/Song/Song';
import { MusicPlayer } from './components/MusicPlayer/MusicPlayer';
import { PagingCollection, Track } from './models/response';
import { useState } from 'react';
import { useTauriInvoke } from './hooks/useTauriInvoke';
import { TracksQuery } from './models/query';

function App() {
    const [selectedOutput, setSelectedOutput] = useState<string | undefined>(
        undefined
    );
    const { data: tracks } = useTauriInvoke<
        TracksQuery,
        PagingCollection<Track>
    >(
        'search_tracks',
        {
            q: selectedOutput ?? '',
        },
        {
            enabled: selectedOutput !== undefined,
        }
    );

    return (
        <main className='font-inter bg-primary text-secondary w-full h-screen overflow-hidden'>
            <div className='flex flex-col w-full h-full'>
                <Navbar setSelectedOutput={setSelectedOutput} />
                <div className='flex-1 overflow-auto'>
                    <div className='flex flex-col gap-4 p-4'>
                        {tracks?.collection.map((track: Track) => (
                            <Song key={track.id?.toString()} track={track} />
                        ))}
                    </div>
                </div>
                <div className='flex-shrink-0'>
                    <MusicPlayer />
                </div>
            </div>
        </main>
    );
}

export default App;
