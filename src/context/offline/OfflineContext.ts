import { createContext, useContext } from 'react';

export type OfflineContextType = {
    isOffline: boolean;
    retryConnection: () => Promise<void>;
    isRetrying: boolean;
};

export const OfflineContext = createContext<OfflineContextType>({
    isOffline: false,
    retryConnection: async () => {},
    isRetrying: false,
});

export const useOfflineContext = () => {
    return useContext(OfflineContext);
};
