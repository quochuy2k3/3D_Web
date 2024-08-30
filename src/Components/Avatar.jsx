import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import character from '../assets/models/asian_female_animated.glb';

export function Avatar({ animation, ...props }) {
  const group = useRef();
  const { scene:avatar, animations: animationsAvatar } = useGLTF(character);
  const { actions } = useAnimations(animationsAvatar, group);
  useEffect(() => {
    actions[animation]?.reset().fadeIn(0.24).play();
    return () => actions?.[animation]?.fadeOut(0.24);
  }, [animation]);

  return (
    <group  ref={group} {...props} dispose={null}>
      <group name="Scene">
        <primitive  object={avatar}   />
      </group> 
        </group>
  );
}
