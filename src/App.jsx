import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import SpinLoader from "./Components/SpinLoader";
import { OrbitControls, SpotLight, useGLTF, useCubeTexture, Environment } from "@react-three/drei";
import * as THREE from 'three';
import PlayerComponent from "./Components/Character";
import WestGate from "./Components/Westgate";


function App() {
  const [playerName, setPlayerName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);

  const handleNameSubmit = () => {
    if (playerName.trim()) {
      setNameSubmitted(true);
    }
  };
  return (
    <section className="w-full h-screen relative">
         {!nameSubmitted ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-5xl mb-4">Wellcome to my demo 3DA</h1>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="border rounded-lg r p-2 w-80 mb-10 mb-4"
            placeholder="What could me call your name"
          />
          <button
            onClick={handleNameSubmit}
            className="bg-blue-500 rounded-lg text-white px-4 py-2"
          >
            Start Game
          </button>
        </div>
      ) : (
      <Canvas
        camera={{
          position: [17.8838, 11.2, -3.72508], 
          fov: 75, 
          near: 0.001,
          far: 1000, 
        }}
        gl={{
          antialias: true,
          logarithmicDepthBuffer: true, // Loại bỏ z-fighting
          toneMapping: THREE.CineonToneMapping, // Ánh xạ tông màu
          outputColorSpace: THREE.SRGBColorSpace, // Không gian màu
          toneMappingExposure: 1.5, // Thiết lập phơi sáng
        }}
      >
        <OrbitControls
          enablePan={false}
          maxDistance={6}
          enableDamping={true}
          dampingFactor={0.1}
        />
        <Suspense fallback={<SpinLoader />}>
          <WestGate />
        </Suspense>
      </Canvas>
      )}
    </section>
  );
}

export default App;
