import { useAudioContext } from '@/context/audio/AudioContext';
import { useNavContext } from '@/context/nav/NavContext';
import { useTauriInvoke } from '@/hooks/useTauriInvoke';
import { TrackWaveformQuery } from '@/models/query';
import { Track, TrackRow } from '@/models/response';
import { Check, LoaderCircle, Pause, Play } from 'lucide-react';
import { Download } from './Download';
import { Settings } from './Settings/Settings';
import { Waveform } from './Waveform';

export interface SongProps {
    track: Track;
}

export interface TrackQuery {
    id: string;
}

export interface SongImageQuery {
    id: string;
}

const Song = (props: SongProps) => {
    const { track } = props;
    const { title, user, artwork_url } = track;
    const { tracks, currentIndex, paused, setPaused, setQueue } =
        useAudioContext();
    const { selectedTab } = useNavContext();
    const trackId = track.id?.toString() ?? '';
    const {
        data: trackRow,
        isLoading,
        isError,
    } = useTauriInvoke<TrackQuery, TrackRow>('get_local_track', {
        id: trackId,
    });

    const { data: image } = useTauriInvoke<SongImageQuery, string>(
        'get_song_image',
        {
            id: trackId,
        },
        {
            enabled: selectedTab === 'library' || selectedTab === 'playlists',
        }
    );

    const { data: waveform } = useTauriInvoke<TrackWaveformQuery, Waveform>(
        'get_track_waveform',
        {
            track: track,
        },
        {
            enabled: selectedTab === 'search',
        }
    );

    const isCurrentTrack = tracks[currentIndex]?.id === track.id;
    const isPlaying = !paused && isCurrentTrack;
    const artwork =
        selectedTab === 'library' || selectedTab === 'playlists'
            ? image
            : artwork_url;
    const wave = selectedTab === 'search' ? waveform : trackRow?.waveform;

    const handlePlayPause = () => {
        if (isCurrentTrack) {
            setPaused(!paused);
        } else {
            setQueue([track]);
        }
    };

    return (
        <div className='flex flex-row w-full items-center gap-4'>
            <div className='relative group'>
                <img
                    className='w-[125px] h-[125px] rounded-lg object-cover'
                    src={artwork}
                    alt={`${title} artwork`}
                />
                <button
                    className='absolute inset-0 m-auto w-12 h-12 bg-white/90 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl'
                    onClick={handlePlayPause}
                >
                    {isPlaying ? (
                        <Pause className='w-6 h-6 text-black' />
                    ) : (
                        <Play className='w-6 h-6 text-black' />
                    )}
                </button>
            </div>
            <div className='flex flex-col flex-1'>
                <div className='flex-1'>
                    <div className='flex flex-row items-center gap-2'>
                        <p className='text-tertiary'>{title}</p>
                        {isLoading ? (
                            <LoaderCircle className='w-4 h-4 text-secondary animate-spin' />
                        ) : isError ? (
                            <Download track={track} />
                        ) : (
                            <Check className='w-4 h-4 text-secondary' />
                        )}
                        <Settings track={track} />
                    </div>
                    <p className='text-secondary'>{user?.username}</p>
                </div>
                <div className='flex flex-1'>
                    <Waveform track={track} waveform={wave} />
                </div>
            </div>
        </div>
    );
};

export { Song };
