import { Download } from '@/components/Song/Download';
import { Song } from '@/components/Song/Song';
import { SongSkeleton } from '@/components/Song/SongSkeleton';
import { useTauriQuery } from '@/hooks/data/query/useTauriQuery';
import { IdQuery } from '@/models/query';
import { Track, Waveform } from '@/models/schemas';

interface SearchSongProps {
    track: Track;
}

const SearchSong = (props: SearchSongProps) => {
    const { track } = props;
    const { id: trackId, title, user, artwork_url } = track;
    const id = trackId as number;

    const { data: waveform, isLoading } = useTauriQuery<IdQuery, Waveform>(
        'get_track_waveform',
        { id }
    );

    if (isLoading || !waveform) {
        return <SongSkeleton />;
    }

    const buttonBar = <Download trackId={id} />;

    return (
        <Song
            key={id}
            trackId={id}
            title={title as string}
            artist={user?.username as string}
            artwork={artwork_url as string}
            waveform={waveform}
            buttonBar={buttonBar}
        />
    );
};

export { SearchSong };
