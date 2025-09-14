import "./App.css";
import { Navbar } from "./components/Navbar";
import { Song } from "./components/Song/Song";
import { MusicPlayer } from "./components/MusicPlayer/MusicPlayer";
import { PagingCollection, Track } from "./models/response";
import { useRef, useState } from "react";
import { useTauriInvoke } from "./hooks/useTauriInvoke";
import { TracksQuery } from "./models/query";
import { BaseDirectory, readFile } from '@tauri-apps/plugin-fs';

function App() {
  const [selectedOutput, setSelectedOutput] = useState<string | undefined>(undefined);
  const { data: tracks } = useTauriInvoke<TracksQuery,PagingCollection<Track>>(
    "search_tracks", { 
      q: selectedOutput ?? ""
    }, {
      enabled: selectedOutput !== undefined,
    }
  );    
  const audioRef = useRef<HTMLAudioElement>(null);

  const loadFile = async () => {
    if (!audioRef.current) return;
    const file = await readFile("music/2127082125.mp3", { baseDir: BaseDirectory.AppLocalData });
    const blob = new Blob([file], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    audioRef.current.src = url; 
    audioRef.current.load();
    audioRef.current.play();
  };

  return (
    <main className="font-inter bg-primary text-secondary w-screen h-screen">
      <div className="flex flex-col w-full h-full overflow-auto justify-start items-start">
        <Navbar setSelectedOutput={setSelectedOutput} />
        <div className="flex flex-col w-full h-full gap-3">
          {tracks?.collection.map((track: Track) => (
            <Song key={track.id?.toString()} track={track} />
          ))}
        </div>
        <div className="mb-10">
          <MusicPlayer />
          <button onClick={loadFile}>Load File</button>
          <audio controls ref={audioRef}/>
        </div>
      </div>
    </main>
  );
}

export default App;