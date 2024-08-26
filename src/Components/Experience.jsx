import { useGLTF } from '@react-three/drei';
import romanVsPersian from '../assets/gm_bigcity.glb';

export const Experience = () => {
  const { scene } = useGLTF(romanVsPersian);

  return (
    <>
      <primitive object={scene} />
    </>
  );
};