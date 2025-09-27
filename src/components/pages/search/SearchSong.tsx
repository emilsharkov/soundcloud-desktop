import { Song } from '@/components/Song/Song';
import { SongSkeleton } from '@/components/Song/SongSkeleton';
import { useTauriQuery } from '@/hooks/data/query/useTauriQuery';
import { TrackWaveformQuery } from '@/models/query';
import { Track, Waveform } from '@/models/response';

interface SearchSongProps {
    track: Track;
}

const SearchSong = (props: SearchSongProps) => {
    const { track } = props;
    const { id, title, user, artwork_url } = track;
    const trackId = id as number;

    const { data: waveform, isLoading } = useTauriQuery<
        TrackWaveformQuery,
        Waveform
    >('get_track_waveform', { trackId });

    if (isLoading || !waveform) {
        return <SongSkeleton />;
    }

    return (
        <Song
            key={id}
            trackId={trackId}
            title={title as string}
            artist={user?.username as string}
            artwork={artwork_url as string}
            waveform={waveform}
        />
    );
};

export { SearchSong };
