import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useRemoveSongFromPlaylistMutation } from '@/hooks/useRemoveSongFromPlaylistMutation';
import { useSettingsContext } from './Settings';

interface SettingsRemoveFromPlaylistProps {
    playlistId: number;
}

const SettingsRemoveFromPlaylist = (props: SettingsRemoveFromPlaylistProps) => {
    const { playlistId } = props;
    const { trackId } = useSettingsContext();
    const { removeSong } = useRemoveSongFromPlaylistMutation(playlistId);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        removeSong({
            playlistId,
            trackId,
        });
    };

    return (
        <DropdownMenuItem onClick={handleClick} variant='destructive'>
            Remove from playlist
        </DropdownMenuItem>
    );
};

export { SettingsRemoveFromPlaylist };
