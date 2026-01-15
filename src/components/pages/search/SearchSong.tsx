import { Download } from '@/components/Song/Download';
import { Song } from '@/components/Song/Song';
import { SongSkeleton } from '@/components/Song/SongSkeleton';
import { QueueContext } from '@/hooks/useQueueStrategy';
import { useTauriQuery } from '@/hooks/useTauriQuery';
import { Track, Waveform, WaveformSchema } from '@/types/schemas';
import {
    GetTrackWaveformQuery,
    GetTrackWaveformQuerySchema,
} from '@/types/schemas/query';
import { getArtwork } from '@/utils/getArtwork';
import { useQuery } from '@tanstack/react-query';

interface SearchSongProps {
    track: Track;
    queueContext?: QueueContext;
}

const SearchSong = (props: SearchSongProps) => {
    const { track, queueContext } = props;
    const { id: trackId, title, user, artwork_url } = track;
    const id = trackId as number;

    const { data: artwork, isLoading: isArtworkLoading } = useQuery({
        queryKey: ['artwork', trackId],
        queryFn: () => getArtwork(artwork_url),
    });

    const { data: waveform, isLoading: isWaveformLoading } = useTauriQuery<
        GetTrackWaveformQuery,
        Waveform
    >(
        'get_track_waveform',
        { id },
        {
            querySchema: GetTrackWaveformQuerySchema,
            responseSchema: WaveformSchema,
        }
    );

    if (
        isArtworkLoading ||
        isWaveformLoading ||
        waveform === undefined ||
        artwork === undefined
    ) {
        return <SongSkeleton />;
    }

    const buttonBar = <Download trackId={id} />;

    return (
        <Song
            key={id}
            trackId={id}
            title={title as string}
            artist={user?.username as string}
            artwork={artwork}
            waveform={waveform}
            buttonBar={buttonBar}
            queueContext={queueContext}
        />
    );
};

export { SearchSong };
