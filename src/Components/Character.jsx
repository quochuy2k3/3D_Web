import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, Vector3 } from 'three';
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useKeyboardControls } from "./useKeyboardControls";
import { Avatar } from "./Avatar";
const normalizeAngle = (angle) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

const lerpAngle = (start, end, t) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  if (Math.abs(end - start) > Math.PI) {
    if (end > start) start += 2 * Math.PI;
    else end += 2 * Math.PI;
  }

  return normalizeAngle(start + (end - start) * t);
};

export function CharacterControl({ octree }) {
  const characterRef = useRef(null);
  const container = useRef(null);
  const camera = useRef(null);
  const cameraTarget = useRef(null);
  const cameraPosition = useRef(null);
  const [animation, setAnimation] = useState("Running");
  const keys = useKeyboardControls();
  const rb = useRef(null);
  const rotationTarget = useRef(0);
  const characterRotationTarget = useRef(0);
  const GRAVITY = -9.81;
  const JUMP_FORCE = 5;
  const RUN_SPEED = 4.5;

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { movementX, movementY } = event;
      if (camera.current) {
        camera.current.rotation.y -= movementX * 0.002; // Điều chỉnh hệ số để thay đổi độ nhạy
        camera.current.rotation.x -= movementY * 0.002;
        camera.current.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.current.rotation.x)); // Giới hạn góc nhìn dọc
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(({ camera, scene }) => {
    if (rb.current) {
      const vel = rb.current.linvel();
      const movement = new Vector3();
      let speed = keys["ShiftLeft"] ? RUN_SPEED : 3;

      if (keys["KeyW"]) movement.z = 1;
      if (keys["KeyS"]) movement.z = -1;
      if (keys["KeyA"]) movement.x = 1;
      if (keys["KeyD"]) movement.x = -1;

      if (movement.length() > 0) {
        rotationTarget.current += 0.05 * movement.x; // Tăng tốc độ xoay của container
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);
        vel.x = Math.sin(rotationTarget.current + characterRotationTarget.current) * speed;
        vel.z = Math.cos(rotationTarget.current + characterRotationTarget.current) * speed;

        setAnimation(speed === RUN_SPEED ? "Running" : "Walking");
      } else {
        setAnimation("Idle");
      }

      if (keys["Space"]) {
        vel.y = JUMP_FORCE;
        setAnimation("Jump");
      }

      // Apply gravity
      vel.y += GRAVITY * 0.1;

      if (characterRef.current) {
        characterRef.current.rotation.y = lerpAngle(characterRef.current.rotation.y, characterRotationTarget.current, 0.3); // Tăng hệ số lerp
      }

      rb.current.setLinvel(vel, true);
    }

    if (animation !== "Idle") {
      container.current.rotation.y = MathUtils.lerp(container.current.rotation.y, rotationTarget.current, 0.1); // Tăng hệ số lerp
      cameraPosition.current.getWorldPosition(camera.position);
      camera.position.lerp(camera.position, 0.1); // Tăng hệ số lerp
      const cameraLookAt = new Vector3();
      cameraTarget.current.getWorldPosition(cameraLookAt);
      camera.lookAt(cameraLookAt);
    }
  });

  return (
    <>
      <RigidBody includeInvisible colliders={false} lockRotations ref={rb}>
        <group ref={container}>
          <group ref={cameraTarget} position-z={1.5} />
          <group ref={cameraPosition} position-y={4} position-z={-4} />
          <group ref={characterRef}>
            <Avatar scale={1} position-y={-0.35} animation={animation} />
          </group>
        </group>
        <CapsuleCollider args={[0.1, 0.3]} />
      </RigidBody>
      <perspectiveCamera ref={camera} position={[0, 2, 5]} />
    </>
  );
}
