"use client";

import { useGLTF, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import {
  Box3,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  MeshStandardMaterial,
  SRGBColorSpace,
  Vector3,
} from "three";

useGLTF.preload("/model.glb");

const flavorTextures = {
  lemonLime: "/labels/lemon-lime.png",
  grape: "/labels/grape.png",
  blackCherry: "/labels/cherry.png",
  strawberryLemonade: "/labels/strawberry.png",
  watermelon: "/labels/watermelon.png",
  pedolac: "/labels/2222222.png",
};

export type SodaCanProps = {
  flavor?: keyof typeof flavorTextures;
  scale?: number;
};

export function SodaCan({ flavor, scale = 4, ...props }: SodaCanProps) {
  const { scene } = useGLTF("/model.glb");
  const gl = useThree((s) => s.gl);
  const labels = useTexture({
    apple: "/labels/apple_package_white_top.png",
    cocktail: "/labels/cocktail_white_top.png",
    pineapple: "/labels/pineapple_white_top.png",
    guava: "/labels/guava_white_top.png",
  });
  const label =
    flavor === "lemonLime"
      ? labels.cocktail
      : flavor === "grape"
        ? labels.pineapple
        : flavor === "blackCherry"
          ? labels.guava
          : labels.apple;

  const cloned = useMemo(() => {
    label.flipY = false;
    label.colorSpace = SRGBColorSpace;
    label.anisotropy = gl.capabilities.getMaxAnisotropy();
    label.minFilter = LinearMipmapLinearFilter;
    label.magFilter = LinearFilter;
    label.generateMipmaps = true;
    label.needsUpdate = true;

    const c = scene.clone(true);
    const box = new Box3().setFromObject(c);
    const center = new Vector3();
    box.getCenter(center);
    c.position.sub(center);

    c.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      const source = mesh.material as MeshStandardMaterial;
      const mat = source.clone();
      mat.map = label;
      mat.needsUpdate = true;
      mesh.material = mat;
    });

    return c;
  }, [scene, label, gl]);

  return (
    <group {...props} dispose={null} scale={scale} rotation={[0, Math.PI / 2, 0]}>
      <primitive object={cloned} />
    </group>
  );
}
