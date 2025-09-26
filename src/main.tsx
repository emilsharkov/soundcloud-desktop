import { AudioProvider } from '@/context/audio/AudioProvider';
import { NavProvider } from '@/context/nav/NavProvider';
import '@fontsource-variable/inter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';
import App from './App';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <QueryClientProvider client={queryClient}>
        <AudioProvider>
            <NavProvider>
                <App />
                <Toaster />
            </NavProvider>
        </AudioProvider>
    </QueryClientProvider>
);
