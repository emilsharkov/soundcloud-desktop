import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useExportSongMutation } from '@/hooks/useExportSongMutation';
import { open as openDialog } from '@tauri-apps/plugin-dialog';
import { useSettingsContext } from './Settings';

const SettingsExport = () => {
    const { trackId } = useSettingsContext();

    const { exportSong, isPending } = useExportSongMutation();

    const handleExport = async () => {
        const folderPath = await openDialog({
            directory: true,
            multiple: false,
        });

        if (!folderPath) {
            return;
        }

        exportSong({ id: trackId, folderPath });
    };

    return (
        <DropdownMenuItem onClick={handleExport} disabled={isPending}>
            Export Song
        </DropdownMenuItem>
    );
};

export { SettingsExport };
