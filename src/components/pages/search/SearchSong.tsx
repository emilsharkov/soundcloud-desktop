import { Download } from '@/components/Song/Download';
import { Song } from '@/components/Song/Song';
import { SongSkeleton } from '@/components/Song/SongSkeleton';
import { QueueContext } from '@/hooks/useQueueStrategy';
import { useSongImage } from '@/hooks/useSongImage';
import { useTrackWaveform } from '@/hooks/useTrackWaveform';
import { Track } from '@/types/schemas';

interface SearchSongProps {
    track: Track;
    queueContext?: QueueContext;
}

const SearchSong = (props: SearchSongProps) => {
    const { track, queueContext } = props;
    const { id: trackId, title, user } = track;
    const id = trackId as number;

    const { data: artwork, isLoading: isArtworkLoading } = useSongImage(id);
    const { data: waveform, isLoading: isWaveformLoading } =
        useTrackWaveform(id);

    if (isArtworkLoading || isWaveformLoading || waveform === undefined) {
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
