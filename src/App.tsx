import { MusicPlayer } from '@/components/MusicPlayer/MusicPlayer';
import { Navbar } from '@/components/Navbar';
import { Library } from '@/components/pages/library/Library';
import { Playlists } from '@/components/pages/playlists/Playlists';
import { Search } from '@/components/pages/search/Search';
import { useNavContext } from '@/context/nav/NavContext';
import './App.css';
import { Tab } from './models/tabs';

const TabComponents: Record<Tab, React.FC> = {
    search: Search,
    library: Library,
    playlists: Playlists,
};

const App = () => {
    const { selectedTab } = useNavContext();
    const TabComponent = TabComponents[selectedTab];

    return (
        <main className='font-inter bg-primary text-secondary w-full h-screen overflow-hidden'>
            <div className='flex flex-col w-full h-full'>
                <Navbar />
                <div className='flex-1 max-w-full overflow-y-auto overflow-x-hidden'>
                    <TabComponent />
                </div>
                <div className='flex-shrink-0'>
                    <MusicPlayer />
                </div>
            </div>
        </main>
    );
};

export default App;
