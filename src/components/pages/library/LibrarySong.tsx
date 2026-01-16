import {
    Settings,
    SettingsAddToPlaylist,
    SettingsDelete,
    SettingsEditMetadata,
    SettingsExport,
} from '@/components/Song/Settings';
import { Song } from '@/components/Song/Song';
import { SongSkeleton } from '@/components/Song/SongSkeleton';
import { SortableItem } from '@/components/ui/sortable-item';
import { QueueContext } from '@/hooks/useQueueStrategy';
import { useSongImage } from '@/hooks/useSongImage';
import { TrackRow } from '@/types/schemas';

interface LibrarySongProps {
    trackRow: TrackRow;
    queueContext?: QueueContext;
}

const LibrarySong = (props: LibrarySongProps) => {
    const { trackRow, queueContext } = props;
    const { id, title, artist, waveform } = trackRow;

    const { data: artwork, isLoading } = useSongImage(id);

    if (isLoading) {
        return <SongSkeleton />;
    }

    const buttonBar = (
        <>
            <Settings trackId={id} title={title} artist={artist}>
                <SettingsEditMetadata />
                <SettingsAddToPlaylist />
                <SettingsExport />
                <SettingsDelete />
            </Settings>
        </>
    );

    return (
        <SortableItem id={id} className='cursor-grab active:cursor-grabbing'>
            <Song
                key={id}
                trackId={id}
                title={title}
                artist={artist}
                artwork={artwork}
                waveform={waveform}
                buttonBar={buttonBar}
                queueContext={queueContext}
            />
        </SortableItem>
    );
};

export { LibrarySong };
