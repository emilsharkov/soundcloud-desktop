import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SortableList } from '@/components/ui/sortable-list';
import { useLocalTracks } from '@/hooks/useLocalTracks';
import { useTauriMutation } from '@/hooks/useTauriMutation';
import {
    ExportLibraryResponse,
    ExportLibraryResponseSchema,
    ReorderTracksResponse,
    ReorderTracksResponseSchema,
    TrackRow,
} from '@/types/schemas';
import {
    ExportLibraryQuery,
    ExportLibraryQuerySchema,
    ReorderTracksQuery,
    ReorderTracksQuerySchema,
} from '@/types/schemas/query';
import { useQueryClient } from '@tanstack/react-query';
import { open as openDialog } from '@tauri-apps/plugin-dialog';
import { MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import { LibrarySong } from './LibrarySong';

const Library = () => {
    const queryClient = useQueryClient();

    const { data: tracks } = useLocalTracks();

    const { mutate: reorderTracks } = useTauriMutation<
        ReorderTracksQuery,
        ReorderTracksResponse
    >('reorder_tracks_command', {
        querySchema: ReorderTracksQuerySchema,
        responseSchema: ReorderTracksResponseSchema,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['get_local_tracks'],
            });
        },
        onError: error => {
            console.error('Failed to reorder tracks', error);
            toast.error('Failed to reorder tracks');
        },
    });

    const { mutate: exportLibrary, isPending: isExporting } = useTauriMutation<
        ExportLibraryQuery,
        ExportLibraryResponse
    >('export_library', {
        querySchema: ExportLibraryQuerySchema,
        responseSchema: ExportLibraryResponseSchema,
        onSuccess: () => {
            toast.success('Library exported successfully');
        },
        onError: error => {
            toast.error(`Failed to export library: ${error.message}`);
        },
    });

    const handleExportLibrary = async () => {
        const folderPath = await openDialog({
            directory: true,
            multiple: false,
        });

        if (!folderPath) {
            return;
        }

        exportLibrary({ folderPath });
    };

    return (
        <div className='flex flex-col gap-4 p-4'>
            <div className='flex flex-row items-center justify-between'>
                <h1 className='text-2xl font-semibold text-secondary'>
                    Library
                </h1>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size='icon' className='shrink-0'>
                            <MoreVertical className='w-5 h-5' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                            onClick={handleExportLibrary}
                            disabled={
                                isExporting || !tracks || tracks.length === 0
                            }
                        >
                            Export Library
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <SortableList
                items={tracks}
                getId={track => track.id}
                onReorder={trackPositions => {
                    reorderTracks({ trackPositions });
                }}
                emptyMessage='No tracks in library'
            >
                {tracks?.map((trackRow: TrackRow) => {
                    const queueContext = {
                        tab: 'library' as const,
                        trackIds: tracks.map(t => t.id),
                    };
                    return (
                        <LibrarySong
                            key={trackRow.id}
                            trackRow={trackRow}
                            queueContext={queueContext}
                        />
                    );
                })}
            </SortableList>
        </div>
    );
};

export { Library };
