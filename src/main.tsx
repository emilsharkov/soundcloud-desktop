import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@fontsource-variable/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AudioProvider } from "./models/audio/AudioProvider";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AudioProvider>
        <App/>
        <Toaster/>
      </AudioProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
