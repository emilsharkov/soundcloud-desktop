import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useDeleteLocalTrackMutation } from '@/hooks/useDeleteLocalTrackMutation';
import { useSettingsContext } from './Settings';

const SettingsDelete = () => {
    const { trackId } = useSettingsContext();
    const { deleteTrack } = useDeleteLocalTrackMutation(trackId);

    const handleDelete = () => {
        deleteTrack({ id: trackId });
    };

    return <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>;
};

export { SettingsDelete };
