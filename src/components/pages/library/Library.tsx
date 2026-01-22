import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchInput } from '@/components/ui/search-input';
import { SortableList } from '@/components/ui/sortable-list';
import { useLibraryMutations } from '@/hooks/useLibraryMutations';
import { useLocalTracks } from '@/hooks/useLocalTracks';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { TrackRow } from '@/types/schemas';
import { open as openDialog } from '@tauri-apps/plugin-dialog';
import { MoreVertical } from 'lucide-react';
import { LibrarySong } from './LibrarySong';

const Library = () => {
    const { data: tracks } = useLocalTracks();

    const { exportLibrary, isExporting, reorderTracks } = useLibraryMutations();

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

    const { query, setQuery, normalizedQuery, filteredItems } = useSearchFilter(
        {
            items: tracks,
            getSearchText: track =>
                `${track.title ?? ''} ${track.artist ?? ''}`,
        }
    );

    return (
        <div className='flex flex-col gap-4 p-4'>
            <div className='flex flex-row items-center justify-between'>
                <h1 className='text-2xl font-semibold text-secondary'>
                    Library
                </h1>
                <DropdownMenu modal={false}>
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
            <SearchInput
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder='Search library'
                aria-label='Search library'
            />
            {normalizedQuery ? (
                filteredItems.length > 0 ? (
                    <div className='flex flex-col gap-2'>
                        {filteredItems.map((trackRow: TrackRow) => {
                            const queueContext = {
                                tab: 'library' as const,
                                trackIds: filteredItems.map(t => t.id),
                            };
                            return (
                                <LibrarySong
                                    key={trackRow.id}
                                    trackRow={trackRow}
                                    queueContext={queueContext}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center py-12 text-tertiary'>
                        <p>No matching tracks</p>
                    </div>
                )
            ) : (
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
            )}
        </div>
    );
};

export { Library };
