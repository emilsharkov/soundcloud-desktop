import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useTauriMutation } from '@/hooks/useTauriMutation';
import { ExportSongQuery, ExportSongQuerySchema } from '@/types/schemas/query';
import {
    ExportSongResponse,
    ExportSongResponseSchema,
} from '@/types/schemas/response';
import { open as openDialog } from '@tauri-apps/plugin-dialog';
import { toast } from 'sonner';
import { useSettingsContext } from './Settings';

const SettingsExport = () => {
    const { trackId } = useSettingsContext();

    const { mutate: exportSong, isPending } = useTauriMutation<
        ExportSongQuery,
        ExportSongResponse
    >('export_song', {
        querySchema: ExportSongQuerySchema,
        responseSchema: ExportSongResponseSchema,
        onSuccess: () => {
            toast.success('Song exported successfully');
        },
        onError: error => {
            toast.error(`Failed to export song: ${error.message}`);
        },
    });

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
