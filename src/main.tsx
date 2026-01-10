import { AudioProvider } from '@/providers/AudioProvider';
import { NavProvider } from '@/providers/NavProvider';
import { OfflineProvider } from '@/providers/OfflineProvider';
import '@fontsource-variable/inter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';
import App from './App';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <QueryClientProvider client={queryClient}>
        <OfflineProvider>
            <AudioProvider>
                <NavProvider>
                    <App />
                    <Toaster />
                </NavProvider>
            </AudioProvider>
        </OfflineProvider>
    </QueryClientProvider>
);
