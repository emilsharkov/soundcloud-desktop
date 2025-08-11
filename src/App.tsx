import "./App.css";
import { Navbar } from "./components/Navbar";
import { Song } from "./components/Song";

function App() {
  return (
    <main className="font-inter bg-primary text-secondary w-screen h-screen">
      <div className="flex flex-col w-full h-full justify-start items-start">
        <Navbar />
        <div className="flex flex-col w-full h-full gap-3">
          {Array.from({ length: 5 }).map(() => {
            return (
              <Song title="Fluxxwave" imageSrc="" waveform={waveform} />
            )
          })}
        </div>
      </div>
    </main>
  );
}

export default App;

const waveform = [
  10,
  11,
  12,
  13,
  14,
  15,
  15,
  15,
  14,
  13,
  13,
  12,
  12,
  13,
  12,
  14,
  17,
  12,
  12,
  12,
  12,
  12,
  12,
]