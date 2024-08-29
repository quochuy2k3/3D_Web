
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, MathUtils } from 'three';
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useKeyboardControls } from "./useKeyboardControls";
import { Avatar } from "./Avatar";
import { OrbitControls } from "@react-three/drei";

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

export function CharacterControl() {
  const characterRef = useRef(null);
  const container = useRef(null);
  const cameraTarget = useRef(null);
  const cameraPosition = useRef(null);
  const [animation, setAnimation] = useState("idle");
  const keys = useKeyboardControls();
  const rb = useRef(null);
  const rotationTarget = useRef(0);
  const characterRotationTarget = useRef(0);
  const [currentAction,setCurrentAction] = useState("Doing")
  const GRAVITY = -9.81;
  const JUMP_FORCE = 5;
  const RUN_SPEED = 1.6;

  useFrame(({ camera }) => {
    if (rb.current) {
      const vel = rb.current.linvel();
      const movement = new Vector3();
      let speed = keys["ShiftLeft"] ? RUN_SPEED : 1;

      if (keys["KeyW"]) movement.z = 1;
      if (keys["KeyS"]) movement.z = -1;
      if (keys["KeyA"]) movement.x = 1;
      if (keys["KeyD"]) movement.x = -1;
    
      if (movement.length() > 0) {
        rotationTarget.current += 0.02 * movement.x;
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);
        vel.x = Math.sin(rotationTarget.current + characterRotationTarget.current) * speed;
        vel.z = Math.cos(rotationTarget.current + characterRotationTarget.current) * speed;
        setAnimation(speed === RUN_SPEED ? "Running" : "Walking");
        setCurrentAction("Doing")
      } else {
        setAnimation("Idle");
        setCurrentAction("Idle")
      }
      if (keys["Space"]) {
        console.log(Math.abs(rb.current.translation().y));
        // if (Math.abs(rb.current.translation().y) < 0.1) {
          vel.y = JUMP_FORCE;
          setAnimation("Jump");
        // }
      }


      // Áp dụng trọng lực
      vel.y += GRAVITY * 0.1; // điều chỉnh sức mạnh của trọng lực và thời gian delta nếu cần

      if (characterRef.current) {
        characterRef.current.rotation.y = lerpAngle(characterRef.current.rotation.y, characterRotationTarget.current, 0.1);
      }

      rb.current.setLinvel(vel, true);
    }

    if(currentAction == "Doing" ){
      container.current.rotation.y = MathUtils.lerp(container.current.rotation.y, rotationTarget.current, 0.1);
      cameraPosition.current.getWorldPosition(camera.position);
      camera.position.lerp(camera.position, 0.1);
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
            <Avatar scale={1} position-y={0.25} animation={animation} /> 
          </group>
        </group>
        <CapsuleCollider args={[0.08, 0.15]} />
      </RigidBody>
    </>
  );
}
