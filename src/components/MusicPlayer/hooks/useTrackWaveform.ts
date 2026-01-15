import { useTauriQuery } from '@/hooks/useTauriQuery';
import {
    GetTrackWaveformQuery,
    GetTrackWaveformQuerySchema,
} from '@/types/schemas/query';
import { Waveform, WaveformSchema } from '@/types/schemas/response/local';

const useTrackWaveform = (selectedTrackId: number | null) => {
    return useTauriQuery<GetTrackWaveformQuery, Waveform>(
        'get_track_waveform',
        { id: selectedTrackId! },
        {
            querySchema: GetTrackWaveformQuerySchema,
            responseSchema: WaveformSchema,
            enabled: selectedTrackId !== null,
        }
    );
};

export { useTrackWaveform };
