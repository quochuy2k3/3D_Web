import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import SpinLoader from "./Components/SpinLoader";
import { OrbitControls, SpotLight, useGLTF, useCubeTexture, Environment } from "@react-three/drei";
import * as THREE from 'three';
import WestGate from "./Components/Westgate";
import environmentPX from './assets/textures/environment/px.png';
import environmentNX from './assets/textures/environment/nx.png';
import environmentPY from './assets/textures/environment/py.png';
import environmentNY from './assets/textures/environment/ny.png';
import environmentPZ from './assets/textures/environment/pz.png';
import environmentNZ from './assets/textures/environment/nz.png';

// import { Character } from "./Components/Avatar";
import { Physics } from "@react-three/rapier";
import { CharacterControl } from "./Components/Character";
import { Map } from "./Components/city";
import { Octree } from "three/examples/jsm/math/Octree";
// import { Avatar } from "./Components/Avatar";


function App() {
  const [playerName, setPlayerName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const octree = new Octree();
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
          fov: 90, 
          near: 0.001,
          far: 1000, 
        }}
        gl={{
          antialias: true,
          logarithmicDepthBuffer: true, 
          toneMapping: THREE.CineonToneMapping,
          outputColorSpace: THREE.SRGBColorSpace, 
          toneMappingExposure: 1.5, 
        }}
      >
    <ambientLight intensity={0.5} />
 
  <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
            castShadow
          />
   
        <Suspense fallback={<SpinLoader />}>
        <Environment files={[
        environmentPX,
        environmentNX,
        environmentPY,
        environmentNY,
        environmentPZ,
        environmentNZ
      ]} background />
      
      <Physics debug>
              <WestGate octree={octree} position={[5, -14, 11]} />
              {/* <Map
          scale={3}
          position={[-6, -10, 0]} /> */}
              <CharacterControl octree={octree} />
            </Physics>
        </Suspense>
      </Canvas>
      )}
    </section>
  );
}

export default App;
