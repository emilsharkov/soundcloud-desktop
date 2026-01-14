import {
    Settings,
    SettingsAddToPlaylist,
    SettingsDelete,
    SettingsEditMetadata,
    SettingsRemoveFromPlaylist,
} from '@/components/Song/Settings';
import { Song } from '@/components/Song/Song';
import { SongSkeleton } from '@/components/Song/SongSkeleton';
import { SortableItem } from '@/components/ui/sortable-item';
import { QueueContext } from '@/hooks/useQueueStrategy';
import { useTauriQuery } from '@/hooks/useTauriQuery';
import {
    GetLocalTrackResponse,
    GetLocalTrackResponseSchema,
    GetSongImageResponse,
    GetSongImageResponseSchema,
    PlaylistSongRow,
} from '@/types/schemas';
import {
    GetLocalTrackQuery,
    GetLocalTrackQuerySchema,
    GetSongImageQuery,
    GetSongImageQuerySchema,
} from '@/types/schemas/query';

interface PlaylistSongProps {
    playlistSong: PlaylistSongRow;
    queueContext?: QueueContext;
}

const PlaylistSong = (props: PlaylistSongProps) => {
    const { playlistSong, queueContext } = props;
    const { track_id, title, artist, playlist_id } = playlistSong;

    const { data: localTrack, isLoading: isLoadingTrack } = useTauriQuery<
        GetLocalTrackQuery,
        GetLocalTrackResponse
    >(
        'get_local_track',
        { id: track_id },
        {
            querySchema: GetLocalTrackQuerySchema,
            responseSchema: GetLocalTrackResponseSchema,
        }
    );

    const { data: artwork, isLoading: isLoadingArtwork } = useTauriQuery<
        GetSongImageQuery,
        GetSongImageResponse
    >(
        'get_song_image',
        { id: track_id },
        {
            querySchema: GetSongImageQuerySchema,
            responseSchema: GetSongImageResponseSchema,
            enabled: localTrack !== undefined,
        }
    );

    if (isLoadingTrack || isLoadingArtwork || !artwork || !localTrack) {
        return <SongSkeleton />;
    }

    const buttonBar = (
        <>
            <Settings trackId={track_id} title={title} artist={artist}>
                <SettingsEditMetadata />
                <SettingsAddToPlaylist />
                <SettingsRemoveFromPlaylist playlistId={playlist_id} />
                <SettingsDelete />
            </Settings>
        </>
    );

    return (
        <SortableItem
            id={track_id}
            className='cursor-grab active:cursor-grabbing'
        >
            <Song
                key={track_id}
                trackId={track_id}
                title={title}
                artist={artist}
                artwork={artwork}
                waveform={localTrack.waveform}
                buttonBar={buttonBar}
                queueContext={queueContext}
            />
        </SortableItem>
    );
};

export { PlaylistSong };
