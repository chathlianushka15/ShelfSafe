import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function HorizonPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color("#1a5e6b") },
    uColor2: { value: new THREE.Color("#6b9e7a") },
    uColor3: { value: new THREE.Color("#fff9f2") },
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime * 0.3;
  });

  const vertexShader = `
    varying vec2 vUv;
    uniform float uTime;
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.z += sin(pos.x * 2.0 + uTime) * 0.15 + cos(pos.y * 1.5 + uTime * 0.7) * 0.1;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    void main() {
      float t = vUv.y + sin(vUv.x * 3.0 + uTime) * 0.05;
      vec3 color = mix(uColor1, uColor2, smoothstep(0.0, 0.5, t));
      color = mix(color, uColor3, smoothstep(0.5, 1.0, t));
      gl_FragColor = vec4(color, 0.85);
    }
  `;

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[8, 6, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function FloatingParticles() {
  const points = useRef<THREE.Points>(null);
  const count = 200;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#e8b45c" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export function HorizonHeroSection() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas camera={{ position: [0, 1, 4], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.4} />
        <HorizonPlane />
        <FloatingParticles />
        <fog attach="fog" args={["#fff9f2", 3, 12]} />
      </Canvas>
    </div>
  );
}
