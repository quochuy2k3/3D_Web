import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, MathUtils, Raycaster } from 'three';
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useKeyboardControls } from "./useKeyboardControls";
import { Avatar } from "./Avatar";
import { OrbitControls } from "@react-three/drei";


export function CharacterControl({ octree }) {
  const characterRef = useRef(null);
  const [animation, setAnimation] = useState("Running");
  const rotationTarget = useRef(0);
  const characterRotationTarget = useRef(0);
  const GRAVITY = -9.81;
  const JUMP_FORCE = 5;
  const RUN_SPEED = 4.5;
  const raycaster = useRef(new Raycaster()).current; // Use a ref to avoid creating a new Raycaster on every frame


  return (
    <>
      <RigidBody includeInvisible colliders={false} lockRotations >
          <group ref={characterRef}>
            <Avatar scale={1} position-y={-0.35} animation={animation} />
          </group>
        <CapsuleCollider args={[0.5, 2]} />
      </RigidBody>
    </>
  );
}
