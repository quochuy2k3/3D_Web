
import { OrbitControls, SpotLight, useGLTF, useCubeTexture, Environment } from "@react-three/drei";
import * as THREE from 'three';
// Import environment cubemap
import environmentPX from '../assets/textures/environment/px.png';
import environmentNX from '../assets/textures/environment/nx.png';
import environmentPY from '../assets/textures/environment/py.png';
import environmentNY from '../assets/textures/environment/ny.png';
import environmentPZ from '../assets/textures/environment/pz.png';
import environmentNZ from '../assets/textures/environment/nz.png';

 // Import models
  import screenGLB from '../assets/models/screen.glb';
  import glassGLB from '../assets/models/glass.glb';
  import barsGLB from '../assets/models/bars.glb';
  import brickGLB from '../assets/models/brick.glb';
  import buildingsGLB from '../assets/models/buildings.glb';
  import easterGLB from '../assets/models/easter.glb';
  import everythingGLB from '../assets/models/everything.glb';
  import floorGLB from '../assets/models/floor.glb';
  import grassGLB from '../assets/models/grass.glb';
  import otherGLB from '../assets/models/other.glb';
  import outsideGLB from '../assets/models/outside.glb';
  import paneraGLB from '../assets/models/panera.glb';
  import plasticGLB from '../assets/models/plastic.glb';
  import tablesGLB from '../assets/models/tables.glb';
  import boxGLB from '../assets/models/box.glb';
  import thirdfloorGLB from '../assets/models/thirdfloor.glb';
  import colliderGLB from '../assets/models/collider.glb';
  import { Octree } from "three/examples/jsm/math/Octree";

  // Import textures
  import barsTexture from '../assets/textures/baked/bars.jpg';
  import brickTexture from '../assets/textures/baked/brick.jpg';
  import buildingsTexture from '../assets/textures/baked/buildings.jpg';
  import easterTexture from '../assets/textures/baked/easter.jpg';
  import everythingTexture from '../assets/textures/baked/everything.jpg';
  import floorTexture from '../assets/textures/baked/floor.jpg';
  import grassTexture from '../assets/textures/baked/grass.jpg';
  import otherTexture from '../assets/textures/baked/other.webp';
  import outsideTexture from '../assets/textures/baked/outside.jpg';
  import paneraTexture from '../assets/textures/baked/panera.jpg';
  import plasticTexture from '../assets/textures/baked/plastic.jpg';
  import tablesTexture from '../assets/textures/baked/tables.jpg';
  import boxTexture from '../assets/textures/baked/box.jpg';
  import thirdfloorTexture from '../assets/textures/baked/thirdfloor.jpg';

  // Video texture
  import videoTexture from '../assets/videos/tour.mp4';
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";


function WestGate({  ...props }) {
  // const { scene } = useThree();

  const textureLoader = new THREE.TextureLoader();
    const { scene,scene: screen } = useGLTF(screenGLB);
    const { scene: glass } = useGLTF(glassGLB);
    const { scene: bars } = useGLTF(barsGLB);
    const { scene: brick } = useGLTF(brickGLB);
    const { scene: buildings } = useGLTF(buildingsGLB);
    const { scene: easter } = useGLTF(easterGLB);
    const { scene: everything } = useGLTF(everythingGLB);
    const { scene: floor } = useGLTF(floorGLB);
    const { scene: grass } = useGLTF(grassGLB);
    const { scene: other } = useGLTF(otherGLB);
    const { scene: outside } = useGLTF(outsideGLB);
    const { scene: panera } = useGLTF(paneraGLB);
    const { scene: plastic } = useGLTF(plasticGLB);
    const { scene: tables } = useGLTF(tablesGLB);
    const { scene: box } = useGLTF(boxGLB);
    const { scene: thirdfloor } = useGLTF(thirdfloorGLB);
    const { scene: collider } = useGLTF(colliderGLB);
    
 
  const videoRef = useRef(null);
  const videoTextureRef = useRef(null);
  useEffect(() => {
    // Create video element
    videoRef.current = document.createElement("video");
    videoRef.current.src = videoTexture; // Import video file
    videoRef.current.muted = true;
    videoRef.current.playsInline = true;
    videoRef.current.autoplay = true;
    videoRef.current.loop = true;
    videoRef.current.play();

    // Create VideoTexture from video element
    videoTextureRef.current = new THREE.VideoTexture(videoRef.current);
    videoTextureRef.current.flipY = false;
    videoTextureRef.current.minFilter = THREE.NearestFilter;
    videoTextureRef.current.magFilter = THREE.NearestFilter;
    videoTextureRef.current.generateMipmaps = false;
    videoTextureRef.current.colorSpace = THREE.SRGBColorSpace;

    // Assign texture to model
    if (screen.children.length > 0) {
      screen.children[0].material = new THREE.MeshBasicMaterial({ map: videoTextureRef.current });
    }
    screen.children[0].material.flipY = false;
    const octree = new Octree();
    octree.fromGraphNode(collider);

    glass.children.forEach((child) => {
      child.material = new THREE.MeshPhysicalMaterial();
      child.material.roughness = 0;
      child.material.color.set(0xdfe5f5);
      child.material.ior = 1.5;
      child.material.transmission = 1;
      child.material.opacity = 1;
    })

    box.children.forEach((child) => {
      const boxTex= textureLoader.load(boxTexture);
      boxTex.flipY = false;
          boxTex.colorSpace = THREE.SRGBColorSpace;
            child.material = new THREE.MeshBasicMaterial({
                map: boxTex,
            });
        });
      bars.children.forEach((child) => {
        const barsTex= textureLoader.load(barsTexture);
        barsTex.flipY = false;
        barsTex.colorSpace = THREE.SRGBColorSpace;
          child.material = new THREE.MeshBasicMaterial({
              map: barsTex,
          });
      });

      brick.children.forEach((child) => {
        const brickTex= textureLoader.load(brickTexture);
        brickTex.flipY = false;
        brickTex.colorSpace = THREE.SRGBColorSpace;

        child.material = new THREE.MeshBasicMaterial({
            map: brickTex,
        });
    });

    buildings.children.forEach((child) => {
      const buildingsTex= textureLoader.load(buildingsTexture);
      buildingsTex.flipY = false;
      buildingsTex.colorSpace =
          THREE.SRGBColorSpace;
      child.material = new THREE.MeshBasicMaterial({
          map: buildingsTex,
      });
  });
    easter.children.forEach((child) => {
      const easterTex= textureLoader.load(easterTexture);
      easterTex.flipY = false;
      easterTex.colorSpace =
          THREE.SRGBColorSpace;
      child.material = new THREE.MeshBasicMaterial({
          map: easterTex,
      });
  });

      everything.children.forEach((child) => {
    const everythingTex= textureLoader.load(everythingTexture);
    everythingTex.flipY = false;
    everythingTex.colorSpace =
          THREE.SRGBColorSpace;
      child.material = new THREE.MeshBasicMaterial({
          map: everythingTex,
      });
  });

  floor.children.forEach((child) => {
  const floorTex= textureLoader.load(floorTexture);
  floorTex.flipY = false;
  floorTex.colorSpace = THREE.SRGBColorSpace;

    child.material = new THREE.MeshBasicMaterial({
        map: floorTex,
    });
});
    grass.children.forEach((child) => {
  const grassTex= textureLoader.load(grassTexture);
  grassTex.flipY = false;
  grassTex.colorSpace = THREE.SRGBColorSpace;
    child.material = new THREE.MeshBasicMaterial({
        map: grassTex,
    });
});
  other.children.forEach((child) => {
  const otherTex= textureLoader.load(otherTexture);

  otherTex.flipY = false;
  otherTex.colorSpace = THREE.SRGBColorSpace;

    child.material = new THREE.MeshBasicMaterial({
        map: otherTex,
        alphaTest: 0.5,
        side: THREE.DoubleSide,
    });
});
  outside.children.forEach((child) => {
  const outsideTex= textureLoader.load(outsideTexture);
  outsideTex.flipY = false;
  outsideTex.colorSpace =
        THREE.SRGBColorSpace;
    child.material = new THREE.MeshBasicMaterial({
        map: outsideTex,
    });
});

  panera.children.forEach((child) => {
  const paneraTex= textureLoader.load(paneraTexture);
  paneraTex.flipY = false;
  paneraTex.colorSpace =
        THREE.SRGBColorSpace;
    child.material = new THREE.MeshBasicMaterial({
        map: paneraTex,
    });
});

  plastic.children.forEach((child) => {
    const plasticTex= textureLoader.load(plasticTexture);
    plasticTex.flipY = false;
  plasticTex.colorSpace =
        THREE.SRGBColorSpace;
    child.material = new THREE.MeshBasicMaterial({
        map: plasticTex,
    });
});
  tables.children.forEach((child) => {
  const tablesTex= textureLoader.load(tablesTexture);
  tablesTex.flipY = false;
  tablesTex.colorSpace =THREE.SRGBColorSpace;
  child.material = new THREE.MeshBasicMaterial({
      map: tablesTex,
  });
});

  thirdfloor.children.forEach((child) => {
  const thirdfloorTex= textureLoader.load(thirdfloorTexture);
  thirdfloorTex.flipY = false;
  thirdfloorTex.colorSpace =THREE.SRGBColorSpace;
  child.material = new THREE.MeshBasicMaterial({
      map: thirdfloorTex,
  });
});
    return () => {
      videoRef.current.pause();
      videoRef.current.src = "";
      videoTextureRef.current.dispose();
    };
  }, []);
    
  return (
    <>
     

      <ambientLight intensity={2} />
      <directionalLight position={[1, 1, 1]} intensity={1} />
      <pointLight position={[10, 5, 10]} intensity={1} />
      <SpotLight
        position={[0, 50, 10]}
        angle={0.15}
        penumbra={1}
        intensity={2}
      />
        <RigidBody type="fixed" colliders="trimesh">
  <group>
          <primitive {...props} object={screen} />
          <primitive {...props} object={glass} />
          <primitive {...props} object={bars} />
          <primitive {...props} object={brick} />
          <primitive {...props} object={buildings} />
          <primitive {...props} object={easter} />
          <primitive {...props} object={everything} />
          <primitive {...props} object={floor} />
          <primitive  {...props}object={grass} />
          <primitive {...props} object={other} />
          <primitive {...props} object={outside} />
          <primitive {...props} object={panera} />
          <primitive {...props} object={plastic} />
          <primitive {...props} object={tables} />
          <primitive {...props} object={box} />
          <primitive  {...props}object={thirdfloor} />      
      </group>
      </RigidBody>

    </>
  );
}

export default WestGate;

