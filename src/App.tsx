import "./App.css";
import AdaptiveAudio from "./components/AdaptiveAudio";
import { Navbar } from "./components/Navbar";
import { Song } from "./components/Song";
import { useAudioContext } from "./context/AudioContext";
import data from "./assets/data.json";
import { Waveform } from "./models/response";

function App() {
  const { audioRef } = useAudioContext()
  
  return (
    <main className="font-inter bg-primary text-secondary w-screen h-screen">
      <div className="flex flex-col w-full h-full overflow-auto justify-start items-start">
        <Navbar />
        <div className="flex flex-col w-full h-full gap-3">
          {Array.from({ length: 5 }).map(() => {
            return (
              <Song title="Fluxxwave" imageSrc="" waveform={data as Waveform} />
            )
          })}
        </div>
        <AdaptiveAudio ref={audioRef} />
      </div>
    </main>
  );
}

export default App;