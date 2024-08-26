import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import SpinLoader from "./Components/SpinLoader";
import { OrbitControls, SpotLight, useGLTF, useCubeTexture, Environment } from "@react-three/drei";
import * as THREE from 'three';
import PlayerComponent from "./Components/Character";
import WestGate from "./Components/Westgate";


function App() {
  return (
    <section className="w-full h-screen relative">
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
    </section>
  );
}

export default App;
