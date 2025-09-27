import { Song } from '@/components/Song/Song';
import { SongSkeleton } from '@/components/Song/SongSkeleton';
import { useTauriQuery } from '@/hooks/data/query/useTauriQuery';
import { TrackIdQuery } from '@/models/query';
import { TrackRow } from '@/models/response';

interface LibrarySongProps {
    trackRow: TrackRow;
}

const LibrarySong = (props: LibrarySongProps) => {
    const { trackRow } = props;
    const { id, title, artist, waveform } = trackRow;

    const { data: artwork, isLoading } = useTauriQuery<TrackIdQuery, string>(
        'get_song_image',
        { id }
    );

    if (isLoading || !artwork) {
        return <SongSkeleton />;
    }

    return (
        <Song
            key={id}
            trackId={id}
            title={title}
            artist={artist}
            artwork={artwork}
            waveform={waveform}
        />
    );
};

export { LibrarySong };
