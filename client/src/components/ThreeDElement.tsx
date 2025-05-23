import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeDElement = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip if no container ref
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    
    // Make the renderer transparent
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Create a group to hold our objects
    const group = new THREE.Group();
    scene.add(group);

    // Function to create a floating cube
    const createCube = (x: number, y: number, z: number, color: number, size: number) => {
      const geometry = new THREE.BoxGeometry(size, size, size);
      const material = new THREE.MeshPhongMaterial({
        color,
        transparent: true,
        opacity: 0.7,
        specular: 0xffffff,
        shininess: 30
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(x, y, z);
      cube.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI, 
        Math.random() * Math.PI
      );
      return cube;
    };

    // Create 3D element - floating cubes with different sizes and colors
    const cubes: THREE.Mesh[] = [];
    
    // Add some cubes to the scene
    cubes.push(createCube(1, 0, -3, 0x2563EB, 0.5)); // Primary light
    cubes.push(createCube(-1, 0, -5, 0x3B82F6, 0.7)); // Secondary
    cubes.push(createCube(0, 1, -4, 0x60A5FA, 0.4)); // Secondary light
    cubes.push(createCube(-0.5, -1, -6, 0x1E3A8A, 0.6)); // Primary
    
    // Add cubes to group
    cubes.forEach(cube => {
      group.add(cube);
    });

    // Add lights
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(1, 1, 1);
    scene.add(light1);
    
    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.position.set(-1, -1, -1);
    scene.add(light2);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Position camera
    camera.position.z = 5;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate each cube slightly
      cubes.forEach((cube, i) => {
        cube.rotation.x += 0.003 + (i * 0.001);
        cube.rotation.y += 0.004 + (i * 0.001);
        
        // Also make them float up and down slightly
        cube.position.y += Math.sin(Date.now() * 0.001 + i) * 0.005;
      });
      
      // Rotate the entire group slowly
      group.rotation.y += 0.003;
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none" />;
};

export default ThreeDElement;
