import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';
import { OfflineContext, OfflineContextType } from './OfflineContext';

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
