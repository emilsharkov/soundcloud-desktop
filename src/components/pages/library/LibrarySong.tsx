import { Settings } from '@/components/Song/Settings/Settings';
import { Song } from '@/components/Song/Song';
import { SongSkeleton } from '@/components/Song/SongSkeleton';
import { useTauriQuery } from '@/hooks/data/query/useTauriQuery';
import { IdQuery } from '@/models/query';
import { TrackRow } from '@/models/response';
import { Check } from 'lucide-react';

interface LibrarySongProps {
    trackRow: TrackRow;
}

const LibrarySong = (props: LibrarySongProps) => {
    const { trackRow } = props;
    const { id, title, artist, waveform } = trackRow;

    const { data: artwork, isLoading } = useTauriQuery<IdQuery, string>(
        'get_song_image',
        { id }
    );

    if (isLoading || !artwork) {
        return <SongSkeleton />;
    }

    const buttonBar = (
        <>
            <Check className='w-4 h-4 text-secondary' />
            <Settings trackId={id} title={title} artist={artist} />
        </>
    );

    return (
        <Song
            key={id}
            trackId={id}
            title={title}
            artist={artist}
            artwork={artwork}
            waveform={waveform}
            buttonBar={buttonBar}
        />
    );
};

export { LibrarySong };
