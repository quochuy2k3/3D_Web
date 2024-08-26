import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Octree } from 'three/examples/jsm/math/Octree';
import { useKeyboardControls } from './useKeyboardControls';

const PlayerComponent = () => {
  const keys = useKeyboardControls();
  const [player, setPlayer] = useState({
    animation: 'idle',
    onFloor: false,
    velocity: new THREE.Vector3(),
    position: new THREE.Vector3(),
  });
  const [jumpOnce, setJumpOnce] = useState(false);

  const playerMeshRef = useRef(null);
  const octree = useRef(new Octree()).current; // Khởi tạo Octree đúng cách

  useFrame(() => {
    if (playerMeshRef.current) {
      const speed = keys.ShiftLeft ? 2 : 1;
      const moveVector = new THREE.Vector3();

      if (keys.KeyW || keys.ArrowUp) moveVector.z -= speed;
      if (keys.KeyS || keys.ArrowDown) moveVector.z += speed;
      if (keys.KeyA || keys.ArrowLeft) moveVector.x -= speed;
      if (keys.KeyD || keys.ArrowRight) moveVector.x += speed;

      if (moveVector.length() > 0) {
        moveVector.normalize().multiplyScalar(speed);
        player.velocity.add(moveVector);
      } else {
        player.velocity.multiplyScalar(0.9);
      }

      player.position.add(player.velocity);
      player.velocity.multiplyScalar(0.9);

      if (keys.Space && player.onFloor) {
        player.velocity.y = 5;
        setJumpOnce(true);
      }

      // Cập nhật vị trí của player
      playerMeshRef.current.position.copy(player.position);

      // Tạo capsule collider để kiểm tra va chạm
      const capsule = new THREE.CapsuleGeometry(0.5, 1, 8, 8);
      capsule.translate(player.position.x, player.position.y, player.position.z);
      
      // Cập nhật collider
      const result = octree.capsuleIntersect(capsule);
      if (result) {
        player.onFloor = result.normal.y > 0;
        player.position.add(result.normal.multiplyScalar(result.depth));
      }
    }
  });

  return (
    <mesh
      ref={playerMeshRef}
      position={player.position}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
};

export default PlayerComponent;
