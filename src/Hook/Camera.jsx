import { useEffect } from "react";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useThree } from "@react-three/fiber";

const CameraOrbitController = () => {
  const { camera, gl } = useThree();
  
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enableDamping = true; // Thêm hiệu ứng damping để điều khiển mượt mà hơn
    controls.dampingFactor = 0.25; // Hệ số damping
    
    return () => {
      controls.dispose();
    };
  }, [camera, gl]);

  return null;
};

export default CameraOrbitController;
