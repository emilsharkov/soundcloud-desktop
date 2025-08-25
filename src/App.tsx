import "./App.css";
import { Navbar } from "./components/Navbar";
import { Song } from "./components/Song";
import data from "./assets/data.json";
import fluxxwaveImage from "./assets/fluxxwave.jpg";
import { MusicPlayer } from "./components/MusicPlayer/MusicPlayer";

function App() {
  return (
    <main className="font-inter bg-primary text-secondary w-screen h-screen">
      <div className="flex flex-col w-full h-full overflow-auto justify-start items-start">
        <Navbar />
        <div className="flex flex-col w-full h-full gap-3">
          {Array.from({ length: 1 }).map(() => {
            return (
              <Song title="Fluxxwave" artist="Clovis Reyes" imageSrc={fluxxwaveImage} waveform={data} />
            )
          })}
        </div>
        <div className="mb-10">
          <MusicPlayer />
        </div>
      </div>
    </main>
  );
}

export default App;