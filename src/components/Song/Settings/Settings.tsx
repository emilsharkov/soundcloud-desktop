import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { useTauriQuery } from '@/hooks/useTauriQuery';
import { Track, TrackSchema } from '@/types/schemas';
import {
    GetLocalTrackQuery,
    GetLocalTrackQuerySchema,
} from '@/types/schemas/query';
import { createContext, ReactNode, useContext } from 'react';
import { SettingsContent } from './SettingsContent';
import { SettingsTrigger } from './SettingsTrigger';

interface SettingsContextValue {
    trackId: number;
    title: string;
    artist: string;
    localTrack: Track | undefined;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export const useSettingsContext = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error(
            'Settings components must be used within a Settings provider'
        );
    }
    return context;
};

interface SettingsProps {
    trackId: number;
    title: string;
    artist: string;
    children: ReactNode;
}

const Settings = (props: SettingsProps) => {
    const { trackId, title, artist, children } = props;
    const { data: localTrack } = useTauriQuery<GetLocalTrackQuery, Track>(
        'get_local_track',
        {
            id: trackId,
        },
        {
            querySchema: GetLocalTrackQuerySchema,
            responseSchema: TrackSchema,
        }
    );

    const contextValue: SettingsContextValue = {
        trackId,
        title,
        artist,
        localTrack,
    };

    if (localTrack === undefined) {
        return null;
    }

    return (
        <SettingsContext.Provider value={contextValue}>
            <DropdownMenu>
                <SettingsTrigger />
                <SettingsContent>{children}</SettingsContent>
            </DropdownMenu>
        </SettingsContext.Provider>
    );
};

export { Settings };
