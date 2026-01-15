import { useTauriQuery } from '@/hooks/useTauriQuery';
import { Waveform, WaveformSchema } from '@/types/schemas';
import {
    GetTrackWaveformQuery,
    GetTrackWaveformQuerySchema,
} from '@/types/schemas/query';

const useTrackWaveform = (trackId: number | null) => {
    return useTauriQuery<GetTrackWaveformQuery, Waveform>(
        'get_track_waveform',
        { id: trackId! },
        {
            querySchema: GetTrackWaveformQuerySchema,
            responseSchema: WaveformSchema,
            enabled: trackId !== null,
        }
    );
};

export { useTrackWaveform };
