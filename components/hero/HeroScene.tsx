"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber";
import clsx from "clsx";
import * as THREE from "three";

import styles from "./hero.module.css";
import {
  useReducedMotionPreference,
  useSceneActivity,
} from "./useSceneActivity";

type Point3 = readonly [number, number, number];

interface TopologyNode {
  color: string;
  position: Point3;
  scale: number;
}

const NODES: readonly TopologyNode[] = [
  { position: [-2.08, -0.72, -0.25], scale: 0.82, color: "#66d8e6" },
  { position: [-1.66, -0.36, 0.18], scale: 1.18, color: "#78e8f3" },
  { position: [-1.56, -1.03, -0.05], scale: 0.7, color: "#9babb3" },
  { position: [-1.02, -0.56, 0.36], scale: 0.9, color: "#74e0ed" },
  { position: [-0.68, -1.19, -0.32], scale: 0.58, color: "#b9e763" },
  { position: [-0.78, 0.1, 0.06], scale: 0.7, color: "#8e9ea7" },
  { position: [-0.44, 0.88, 0.24], scale: 1.02, color: "#69dce9" },
  { position: [0.08, 1.38, -0.2], scale: 0.68, color: "#a6b2b8" },
  { position: [0.49, 0.82, 0.42], scale: 1.22, color: "#c2ef6c" },
  { position: [0.01, 0.28, 0.12], scale: 0.73, color: "#7ae3ee" },
  { position: [0.88, 0.08, -0.12], scale: 0.72, color: "#8da0a9" },
  { position: [1.24, -0.38, 0.16], scale: 0.92, color: "#6ddce9" },
  { position: [1.72, 0.17, 0.34], scale: 1.2, color: "#79e8f2" },
  { position: [2.14, -0.43, -0.21], scale: 0.68, color: "#a7b1b6" },
  { position: [1.86, -1.03, 0.05], scale: 0.86, color: "#bce965" },
  { position: [1.1, -1.2, -0.28], scale: 0.6, color: "#7fdce5" },
  { position: [0.29, -0.83, 0.33], scale: 0.72, color: "#95a4ac" },
  { position: [-0.08, -1.55, -0.13], scale: 0.64, color: "#66d7e4" },
  { position: [-1.0, -1.54, 0.1], scale: 0.52, color: "#9eabb1" },
] as const;

const EDGES = [
  [0, 1],
  [0, 2],
  [1, 2],
  [1, 3],
  [2, 4],
  [3, 4],
  [3, 5],
  [5, 6],
  [5, 9],
  [6, 7],
  [6, 8],
  [7, 8],
  [8, 9],
  [8, 10],
  [9, 10],
  [9, 16],
  [10, 11],
  [10, 12],
  [11, 12],
  [11, 15],
  [12, 13],
  [12, 14],
  [13, 14],
  [14, 15],
  [15, 16],
  [16, 17],
  [17, 18],
  [4, 18],
] as const;

const PULSE_PATHS = [
  { from: 0, to: 1, speed: 0.42, delay: 0 },
  { from: 3, to: 5, speed: 0.35, delay: 0.34 },
  { from: 6, to: 8, speed: 0.3, delay: 0.68 },
  { from: 9, to: 10, speed: 0.45, delay: 0.18 },
  { from: 10, to: 12, speed: 0.34, delay: 0.75 },
  { from: 12, to: 14, speed: 0.38, delay: 0.47 },
] as const;

interface PointerTarget {
  current: { x: number; y: number };
}

function EdgeField() {
  const positions = useMemo(() => {
    const values = new Float32Array(EDGES.length * 6);

    EDGES.forEach(([from, to], index) => {
      values.set(NODES[from].position, index * 6);
      values.set(NODES[to].position, index * 6 + 3);
    });

    return values;
  }, []);

  return (
    <lineSegments frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#78909a" opacity={0.24} transparent />
    </lineSegments>
  );
}

function NodeField() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const transform = new THREE.Object3D();
    const color = new THREE.Color();

    NODES.forEach((node, index) => {
      transform.position.set(...node.position);
      transform.scale.setScalar(node.scale);
      transform.updateMatrix();
      mesh.setMatrixAt(index, transform.matrix);
      mesh.setColorAt(index, color.set(node.color));
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, []);

  return (
    <instancedMesh
      args={[undefined, undefined, NODES.length]}
      frustumCulled={false}
      ref={meshRef}
    >
      <sphereGeometry args={[0.072, 10, 10]} />
      <meshBasicMaterial opacity={0.92} transparent vertexColors />
    </instancedMesh>
  );
}

function PulseField({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const elapsedRef = useRef(0);
  const transform = useMemo(() => new THREE.Object3D(), []);
  const point = useMemo(() => new THREE.Vector3(), []);
  const source = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);

  const updateInstances = useCallback(
    (elapsed: number) => {
      const mesh = meshRef.current;
      if (!mesh) return;

      PULSE_PATHS.forEach((path, index) => {
        const progress = (elapsed * path.speed + path.delay) % 1;
        source.set(...NODES[path.from].position);
        target.set(...NODES[path.to].position);
        point.lerpVectors(source, target, progress);
        transform.position.copy(point);
        transform.scale.setScalar(0.82 + Math.sin(progress * Math.PI) * 0.45);
        transform.updateMatrix();
        mesh.setMatrixAt(index, transform.matrix);
      });

      mesh.instanceMatrix.needsUpdate = true;
    },
    [point, source, target, transform],
  );

  useLayoutEffect(() => updateInstances(0), [updateInstances]);

  useFrame((_, delta) => {
    if (!active) return;
    elapsedRef.current += Math.min(delta, 0.05);
    updateInstances(elapsedRef.current);
  });

  return (
    <instancedMesh
      args={[undefined, undefined, PULSE_PATHS.length]}
      frustumCulled={false}
      ref={meshRef}
    >
      <sphereGeometry args={[0.038, 8, 8]} />
      <meshBasicMaterial color="#c5f467" />
    </instancedMesh>
  );
}

function AnimationDriver({ active }: { active: boolean }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
    if (!active) return;

    let frame = 0;
    const render = () => {
      invalidate();
      frame = window.requestAnimationFrame(render);
    };

    frame = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(frame);
  }, [active, invalidate]);

  return null;
}

function Topology({
  active,
  pointerTarget,
}: {
  active: boolean;
  pointerTarget: PointerTarget;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group || !active) return;

    group.rotation.y = THREE.MathUtils.damp(
      group.rotation.y,
      pointerTarget.current.x * 0.105,
      4.2,
      delta,
    );
    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      pointerTarget.current.y * -0.07,
      4.2,
      delta,
    );
    group.position.x = THREE.MathUtils.damp(
      group.position.x,
      pointerTarget.current.x * 0.055,
      4,
      delta,
    );
  });

  return (
    <group ref={groupRef} rotation={[0.04, -0.08, -0.02]}>
      <EdgeField />
      <NodeField />
      <PulseField active={active} />
    </group>
  );
}

export interface HeroSceneProps {
  active?: boolean;
  className?: string;
  onContextLost?: () => void;
  onReady?: () => void;
  paused?: boolean;
  reducedMotion?: boolean;
}

export function HeroScene({
  active = true,
  className,
  onContextLost,
  onReady,
  paused = false,
  reducedMotion = false,
}: HeroSceneProps) {
  const shouldReduceMotion = useReducedMotionPreference(reducedMotion);
  const { active: sceneActive, containerRef } = useSceneActivity({
    disabled: paused || !active || shouldReduceMotion,
  });
  const pointerTarget = useRef({ x: 0, y: 0 });
  const cleanupContextListener = useRef<(() => void) | null>(null);
  const readyNotified = useRef(false);

  useEffect(() => {
    if (!sceneActive) {
      pointerTarget.current = { x: 0, y: 0 };
      return;
    }

    const updatePointer = (event: PointerEvent) => {
      pointerTarget.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };
    };
    const resetPointer = () => {
      pointerTarget.current = { x: 0, y: 0 };
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });
    document.documentElement.addEventListener("mouseleave", resetPointer);

    return () => {
      window.removeEventListener("pointermove", updatePointer);
      document.documentElement.removeEventListener("mouseleave", resetPointer);
    };
  }, [sceneActive]);

  useEffect(
    () => () => {
      cleanupContextListener.current?.();
    },
    [],
  );

  const handleCreated = useCallback(
    ({ gl }: RootState) => {
      cleanupContextListener.current?.();

      const canvas = gl.domElement;
      const handleLoss = (event: Event) => {
        event.preventDefault();
        onContextLost?.();
      };

      canvas.addEventListener("webglcontextlost", handleLoss, false);
      cleanupContextListener.current = () =>
        canvas.removeEventListener("webglcontextlost", handleLoss, false);

      if (!readyNotified.current) {
        window.requestAnimationFrame(() => {
          readyNotified.current = true;
          onReady?.();
        });
      }
    },
    [onContextLost, onReady],
  );

  return (
    <div
      aria-hidden="true"
      className={clsx(styles.scene, className)}
      ref={containerRef}
    >
      <Canvas
        camera={{ fov: 42, near: 0.1, far: 30, position: [0, 0, 5.5] }}
        dpr={[1, 1.5]}
        fallback={null}
        frameloop="demand"
        gl={{
          alpha: true,
          antialias: true,
          depth: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        onCreated={handleCreated}
      >
        <AnimationDriver active={sceneActive} />
        <Topology active={sceneActive} pointerTarget={pointerTarget} />
      </Canvas>
      <div className={styles.sceneLabels}>
        <span className={styles.systemsLabel}>SYSTEMS / 01</span>
        <span className={styles.dataLabel}>DATA / 02</span>
        <span className={styles.intelligenceLabel}>INTELLIGENCE / 03</span>
      </div>
    </div>
  );
}

export default HeroScene;
