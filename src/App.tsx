import { MusicPlayer } from '@/components/MusicPlayer/MusicPlayer';
import { Navbar } from '@/components/Navbar';
import { Library } from '@/components/pages/library/Library';
import { Playlists } from '@/components/pages/playlists/Playlists';
import { Search } from '@/components/pages/search/Search';
import { useNavContext } from '@/context/nav/NavContext';
import './App.css';

function App() {
    const { selectedTab } = useNavContext();

    return (
        <main className='font-inter bg-primary text-secondary w-full h-screen overflow-hidden'>
            <div className='flex flex-col w-full h-full'>
                <Navbar />
                <div className='flex-1 overflow-auto'>
                    {selectedTab === 'search' && <Search />}
                    {selectedTab === 'library' && <Library />}
                    {selectedTab === 'playlists' && <Playlists />}
                </div>
                <div className='flex-shrink-0'>
                    <MusicPlayer />
                </div>
            </div>
        </main>
    );
}

export default App;
