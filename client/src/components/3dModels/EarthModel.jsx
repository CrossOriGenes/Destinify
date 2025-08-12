import { useEffect, useRef, useMemo } from "react";
import { useGraph, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";

export default function EarthModel(props) {
  const group = useRef();
  const { scene, animations } = useGLTF("/earth/earth-cartoon.glb");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.geometry.computeVertexNormals();
        child.material.flatShading = false;
        child.material.needsUpdate = true;
      }
    });

    Object.values(actions).forEach((action) => {
      action.play();
    });
  }, [scene, actions]);

  useFrame(() => {
    group.current.rotation.y += 0.0001;
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene" scale={1.35}>
        <group
          name="Armature001"
          position={[0.564, 0.451, 0.62]}
          rotation={[0.708, -0.369, -0.737]}
          scale={0.01}
        >
          <primitive object={nodes.Main} />
          <skinnedMesh
            name="colaBallena001"
            geometry={nodes.colaBallena001.geometry}
            material={materials.ballena}
            skeleton={nodes.colaBallena001.skeleton}
          />
        </group>
        <group
          name="Armature002"
          position={[-0.846, -0.218, -0.378]}
          rotation={[2.298, 0.497, 1.648]}
          scale={0.01}
        >
          <primitive object={nodes.Main_1} />
          <skinnedMesh
            name="colaBallena002"
            geometry={nodes.colaBallena002.geometry}
            material={materials.ballena}
            skeleton={nodes.colaBallena002.skeleton}
          />
        </group>
        <group
          name="Armature003"
          position={[0.43, -0.474, -0.704]}
          rotation={[-0.216, 1.029, -1.973]}
          scale={0.01}
        >
          <primitive object={nodes.Main_2} />
          <skinnedMesh
            name="colaBallena003"
            geometry={nodes.colaBallena003.geometry}
            material={materials.ballena}
            skeleton={nodes.colaBallena003.skeleton}
          />
        </group>
        <mesh
          name="Oceano"
          geometry={nodes.Oceano.geometry}
          material={materials.agua}
        >
          <mesh
            name="tierra"
            geometry={nodes.tierra.geometry}
            material={materials.tierra}
            scale={0.996}
          />
        </mesh>
        <mesh
          name="barco"
          geometry={nodes.barco.geometry}
          material={materials.Atlas_1}
          position={[0.644, -0.215, -0.719]}
          rotation={[-1.679, 0.395, 0.896]}
          scale={[0.015, 0.021, 0.016]}
        />
        <mesh
          name="barco009"
          geometry={nodes.barco009.geometry}
          material={materials["Atlas.2"]}
          position={[0.848, 0.333, 0.4]}
          rotation={[-1.408, -0.59, -1.937]}
          scale={0.01}
        />
        <mesh
          name="avion003"
          geometry={nodes.avion003.geometry}
          material={materials["Atlas.2"]}
          position={[-0.409, -1.016, 0.477]}
          rotation={[-0.438, 0, 2.792]}
          scale={0.018}
        >
          <mesh
            name="Cube009"
            geometry={nodes.Cube009.geometry}
            material={materials["Atlas.2"]}
            position={[-3.44, -0.807, 0]}
            rotation={[2.338, 0, 0]}
            scale={[0.319, 0.221, 0.221]}
          />
          <mesh
            name="avion004"
            geometry={nodes.avion004.geometry}
            material={materials["ox-logo"]}
          />
        </mesh>
        <mesh
          name="ox-logo008"
          geometry={nodes["ox-logo008"].geometry}
          material={materials["Atlas.2"]}
          position={[-0.954, 0.859, 0.547]}
          rotation={[2.135, 0.755, 0.825]}
          scale={0.141}
        />
        <mesh
          name="ox-logo009"
          geometry={nodes["ox-logo009"].geometry}
          material={materials["Atlas.2"]}
          position={[-0.842, 0.381, -1.049]}
          rotation={[0.344, 0.653, 0.461]}
          scale={0.141}
        />
        <mesh
          name="edificio001"
          geometry={nodes.edificio001.geometry}
          material={materials["Atlas.2"]}
          position={[0.969, 0.299, 0.303]}
          rotation={[0.057, -0.309, -1.25]}
          scale={[0.007, 0.018, 0.007]}
        />
        <mesh
          name="avion001"
          geometry={nodes.avion001.geometry}
          material={materials["ox-logo"]}
          position={[0.01, 0.636, 1.074]}
          rotation={[1.036, 0, 0]}
          scale={0.018}
        />
        <mesh
          name="ox-logo001"
          geometry={nodes["ox-logo001"].geometry}
          material={materials["ox-logo"]}
          position={[-0.954, 0.859, 0.547]}
          rotation={[2.135, 0.755, 0.825]}
          scale={0.141}
        />
        <mesh
          name="ox-logo002"
          geometry={nodes["ox-logo002"].geometry}
          material={materials["ox-logo"]}
          position={[-0.842, 0.381, -1.049]}
          rotation={[0.344, 0.653, 0.461]}
          scale={0.141}
        />
        <mesh
          name="avion002"
          geometry={nodes.avion002.geometry}
          material={materials["Atlas.2"]}
          position={[0.01, 0.636, 1.074]}
          rotation={[1.036, 0, 0]}
          scale={0.018}
        >
          <mesh
            name="Cube001"
            geometry={nodes.Cube001.geometry}
            material={materials["Atlas.2"]}
            position={[-3.44, -0.807, 0]}
            rotation={[2.338, 0, 0]}
            scale={[0.319, 0.221, 0.221]}
          />
        </mesh>
        <mesh
          name="arbol007"
          geometry={nodes.arbol007.geometry}
          material={materials.vegetación}
          position={[0.851, 0.605, -0.005]}
          rotation={[0.173, 0.354, -1.1]}
          scale={0.011}
        />
        <mesh
          name="Icosphere004"
          geometry={nodes.Icosphere004.geometry}
          material={materials.nube}
          position={[-0.012, 1.161, 0.6]}
          rotation={[Math.PI / 2, -1.053, Math.PI / 2]}
          scale={[0.045, 0.035, 0.045]}
        />
        <mesh
          name="nube002"
          geometry={nodes.nube002.geometry}
          material={materials.nube}
          position={[-0.003, 0, 1.572]}
          rotation={[2.489, -1.503, -0.655]}
          scale={[-0.023, -0.017, -0.023]}
        />
        <mesh
          name="Icosphere006"
          geometry={nodes.Icosphere006.geometry}
          material={materials.nube}
          position={[1.421, 0.599, -0.52]}
          rotation={[-3.11, -0.434, -3.05]}
          scale={[0.063, 0.055, 0.052]}
        />
        <mesh
          name="nube003"
          geometry={nodes.nube003.geometry}
          material={materials.nube}
          position={[0.587, -0.527, -1.197]}
          rotation={[0.076, 0.992, 3.078]}
          scale={[-0.018, -0.013, -0.018]}
        />
        <mesh
          name="Icosphere007"
          geometry={nodes.Icosphere007.geometry}
          material={materials.nube}
          position={[-0.495, -1.3, -0.305]}
          rotation={[0.594, -0.483, 0.304]}
          scale={[0.05, 0.039, 0.05]}
        />
        <mesh
          name="Icosphere008"
          geometry={nodes.Icosphere008.geometry}
          material={materials.nube}
          position={[-1.436, -0.22, -0.172]}
          rotation={[0.518, 0.025, -0.014]}
          scale={[0.045, 0.035, 0.045]}
        />
        <mesh
          name="Icosphere009"
          geometry={nodes.Icosphere009.geometry}
          material={materials.nube}
          position={[0.952, 0.357, 1.09]}
          rotation={[2.426, 0.715, -2.624]}
          scale={[0.045, 0.035, 0.045]}
        />
        <mesh
          name="nube004"
          geometry={nodes.nube004.geometry}
          material={materials.nube}
          position={[-0.487, 0.642, -1.03]}
          rotation={[0.098, -1.134, -3.052]}
          scale={[-0.023, -0.017, -0.023]}
        />
        <mesh
          name="nube005"
          geometry={nodes.nube005.geometry}
          material={materials.nube}
          position={[-1.119, -0.737, 0.257]}
          rotation={[0.043, 0.22, 3.129]}
          scale={[-0.023, -0.017, -0.023]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/earth/earth-cartoon.glb");
