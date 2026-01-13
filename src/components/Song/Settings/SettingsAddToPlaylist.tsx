import { AddToPlaylist } from '@/components/Song/AddToPlaylist';
import { useSettingsContext } from './Settings';

const SettingsAddToPlaylist = () => {
    const { trackId } = useSettingsContext();
    return <AddToPlaylist trackId={trackId} variant='menu' />;
};

export { SettingsAddToPlaylist };
