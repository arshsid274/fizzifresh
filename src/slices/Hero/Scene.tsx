"use client";

import { useRef } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import { Group } from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import FloatingCan from "@/components/FloatingCan";
import { useStore } from "@/hooks/useStore";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {};

export default function Scene({}: Props) {
  const isReady = useStore((state) => state.isReady);

  const can1Ref = useRef<Group>(null);
  const can2Ref = useRef<Group>(null);
  const can3Ref = useRef<Group>(null);
  const can4Ref = useRef<Group>(null);
  const can5Ref = useRef<Group>(null);

  const can1GroupRef = useRef<Group>(null);
  const can2GroupRef = useRef<Group>(null);

  const groupRef = useRef<Group>(null);

  const FLOAT_SPEED = 1.5;

  useGSAP(() => {
    if (
      !can1Ref.current ||
      !can2Ref.current ||
      !can3Ref.current ||
      !can4Ref.current ||
      !can5Ref.current ||
      !can1GroupRef.current ||
      !can2GroupRef.current ||
      !groupRef.current
    )
      return;

    isReady();

    // Set can starting location: cans face camera (no tilt)
    gsap.set(can1Ref.current.position, { x: -1.5 });
    gsap.set(can1Ref.current.rotation, { x: 0, y: 0, z: 0 });

    gsap.set(can2Ref.current.position, { x: 1.5 });
    gsap.set(can2Ref.current.rotation, { x: 0, y: 0, z: 0 });

    gsap.set(can3Ref.current.position, { y: 5, z: 2 });
    gsap.set(can4Ref.current.position, { x: 2, y: 4, z: 2 });
    gsap.set(can5Ref.current.position, { y: -5 });

    const introTl = gsap.timeline({
      defaults: {
        duration: 3,
        ease: "back.out(1.4)",
      },
    });

    if (window.scrollY < 20) {
      introTl
        .from(can1GroupRef.current.position, { y: -5, x: 1 }, 0)
        .from(can2GroupRef.current.position, { y: 5, x: 1 }, 0);
    }

    const scrollTl = gsap.timeline({
      defaults: {
        duration: 2,
      },
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });

    // Final layout on the "TRY ALL FIVE FLAVORS" panel: 5 cartons in a
    // horizontal row at the same height, evenly spaced, upright.
    const ROW_Y = 0;
    const ROW_Z = 0;
    const ROW_SPACING = 1;
    const rowX = [-2, -1, 0, 1, 2].map((i) => i * ROW_SPACING);

    scrollTl
      .to(groupRef.current.rotation, { y: Math.PI * 2 })
      .to(groupRef.current.position, { x: 0, y: 0, z: 0 }, 0)

      .to(can1Ref.current.position, { x: rowX[0], y: ROW_Y, z: ROW_Z }, 0)
      .to(can1Ref.current.rotation, { x: 0, y: Math.PI / 9, z: 0 }, 0)

      .to(can2Ref.current.position, { x: rowX[1], y: ROW_Y, z: ROW_Z }, 0)
      .to(can2Ref.current.rotation, { x: 0, y: Math.PI / 9, z: 0 }, 0)

      .to(can3Ref.current.position, { x: rowX[2], y: ROW_Y, z: ROW_Z }, 0)
      .to(can3Ref.current.rotation, { x: 0, y: Math.PI / 9, z: 0 }, 0)

      .to(can4Ref.current.position, { x: rowX[3], y: ROW_Y, z: ROW_Z }, 0)
      .to(can4Ref.current.rotation, { x: 0, y: Math.PI / 9, z: 0 }, 0)

      .to(can5Ref.current.position, { x: rowX[4], y: ROW_Y, z: ROW_Z }, 0)
      .to(can5Ref.current.rotation, { x: 0, y: Math.PI / 9, z: 0 }, 0)

      // Reset the parent group's intra-section drift
      .to(can1GroupRef.current.position, { x: 0, y: 0 }, 0)
      .to(can2GroupRef.current.position, { x: 0, y: 0 }, 0);
  });

  return (
    <group ref={groupRef}>
      <group ref={can1GroupRef}>
        <FloatingCan
          ref={can1Ref}
          flavor="blackCherry"
          floatSpeed={FLOAT_SPEED}
          rotationIntensity={0}
        />
      </group>
      <group ref={can2GroupRef}>
        <FloatingCan
          ref={can2Ref}
          flavor="lemonLime"
          floatSpeed={FLOAT_SPEED}
          rotationIntensity={0}
        />
      </group>

      <FloatingCan
        ref={can3Ref}
        flavor="grape"
        floatSpeed={FLOAT_SPEED}
        rotationIntensity={0}
      />

      <FloatingCan
        ref={can4Ref}
        flavor="strawberryLemonade"
        floatSpeed={FLOAT_SPEED}
        rotationIntensity={0}
      />

      <FloatingCan
        ref={can5Ref}
        flavor="watermelon"
        floatSpeed={FLOAT_SPEED}
        rotationIntensity={0}
      />

      {/* <OrbitControls /> */}
      <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
    </group>
  );
}
