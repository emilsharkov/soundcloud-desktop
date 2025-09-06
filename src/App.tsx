import "./App.css";
import { Navbar } from "./components/Navbar";
import { Song } from "./components/Song";
import { MusicPlayer } from "./components/MusicPlayer/MusicPlayer";
import { PagingCollection, Track } from "./models/response";
import { useState } from "react";
import { useTauriInvoke } from "./hooks/useTauriInvoke";
import { TracksQuery } from "./models/query";

function App() {
  const [selectedOutput, setSelectedOutput] = useState<string | undefined>(undefined);
  const { data: tracks } = useTauriInvoke<TracksQuery,PagingCollection<Track>>(
    "search_tracks", { 
      q: selectedOutput ?? ""
    }, {
      enabled: selectedOutput !== undefined,
    }
  );    

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
        </div>
      </div>
    </main>
  );
}

export default App;