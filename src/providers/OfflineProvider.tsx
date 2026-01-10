import { invoke } from '@tauri-apps/api/core';
import { createContext, useContext, useEffect, useState } from 'react';

export type OfflineContextType = {
    isOffline: boolean;
    retryConnection: () => Promise<void>;
    isRetrying: boolean;
};

const OfflineContext = createContext<OfflineContextType>({
    isOffline: false,
    retryConnection: async () => {},
    isRetrying: false,
});

export const useOffline = () => {
    return useContext(OfflineContext);
};

export interface OfflineProviderProps {
    children: React.ReactNode;
}

export const OfflineProvider = (props: OfflineProviderProps) => {
    const { children } = props;
    const [isOffline, setIsOffline] = useState<boolean>(false);
    const [isRetrying, setIsRetrying] = useState<boolean>(false);

    // Poll health check every 30 seconds
    useEffect(() => {
        const pollHealthCheck = async () => {
            try {
                const isOnline = await invoke<boolean>('test_connectivity');
                setIsOffline(!isOnline);
            } catch (error) {
                console.error('Health check failed:', error);
                setIsOffline(true);
            }
        };

        // Initial check
        pollHealthCheck();

        // Set up polling interval (30 seconds)
        const interval = setInterval(pollHealthCheck, 30000);

        return () => clearInterval(interval);
    }, []);

    const retryConnection = async () => {
        setIsRetrying(true);
        try {
            const isOnline = await invoke<boolean>('test_connectivity');
            setIsOffline(!isOnline);
        } catch (error) {
            console.error('Retry connection failed:', error);
            setIsOffline(true);
        } finally {
            setIsRetrying(false);
        }
    };

    const contextValue: OfflineContextType = {
        isOffline,
        retryConnection,
        isRetrying,
    };

    return (
        <OfflineContext.Provider value={contextValue}>
            {children}
        </OfflineContext.Provider>
    );
};
