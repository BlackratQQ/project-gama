import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface GridDistortionProps {
  grid?: number;
  mouse?: number;
  strength?: number;
  relaxation?: number;
  imageSrc: string;
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
  // Loading effect parameters
  loadingDuration?: number;
  loadingStrength?: number;
  loadingSpeed?: number;
  loadingPattern?: 'wave' | 'ripple' | 'chaos';
  initialDelay?: number;
}

const vertexShader = `
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uDataTexture;
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec4 offset = texture2D(uDataTexture, vUv);
  gl_FragColor = texture2D(uTexture, uv - 0.02 * offset.rg);
}
`;

const GridDistortion: React.FC<GridDistortionProps> = ({
  grid = 15,
  mouse = 0.1,
  strength = 0.15,
  relaxation = 0.9,
  imageSrc,
  className = '',
  alt: _alt = '',
  width: _width,
  height: _height,
  loadingDuration = 3000,
  loadingStrength = 2.0,
  loadingSpeed = 5,
  loadingPattern = 'wave',
  initialDelay = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageAspectRef = useRef<number>(1);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const initialDataRef = useRef<Float32Array | null>(null);
  const isHoveredRef = useRef(false);
  const isLoadingRef = useRef(true);
  const loadingStartTime = useRef<number>(Date.now());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (initialDelay > 0) {
      const delayTimeout = setTimeout(() => setIsInitialized(true), initialDelay);
      return () => clearTimeout(delayTimeout);
    } else {
      setIsInitialized(true);
    }
  }, [initialDelay]);

  useEffect(() => {
    console.warn(
      'GridDistortion: Effect running, isInitialized:',
      isInitialized,
      'container:',
      !!containerRef.current,
      'loadingDuration:',
      loadingDuration,
      'initialDelay:',
      initialDelay
    );
    if (!containerRef.current || !isInitialized) return;

    // Reset loading timer at the start of the effect
    loadingStartTime.current = Date.now();
    isLoadingRef.current = true;
    console.warn('GridDistortion: Starting loading phase at', new Date().toLocaleTimeString());

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(0, 0, 0, 0, -1000, 1000);
    camera.position.z = 2;
    cameraRef.current = camera;

    const uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector4() },
      uTexture: { value: null as THREE.Texture | null },
      uDataTexture: { value: null as THREE.DataTexture | null },
    };

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      imageSrc,
      (texture) => {
        texture.minFilter = THREE.LinearFilter;
        imageAspectRef.current = texture.image.width / texture.image.height;
        uniforms.uTexture.value = texture;
        handleResize();
        console.warn('GridDistortion: Texture loaded successfully');
      },
      undefined,
      (error) => {
        console.error('GridDistortion: Error loading texture:', error);
      }
    );

    const size = grid;
    const data = new Float32Array(4 * size * size);
    for (let i = 0; i < size * size; i++) {
      data[i * 4] = Math.random() * 255 - 125;
      data[i * 4 + 1] = Math.random() * 255 - 125;
    }
    initialDataRef.current = new Float32Array(data);

    const dataTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
    dataTexture.needsUpdate = true;
    uniforms.uDataTexture.value = dataTexture;

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms,
      vertexShader,
      fragmentShader,
    });
    const geometry = new THREE.PlaneGeometry(1, 1, size - 1, size - 1);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    const handleResize = () => {
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      const containerAspect = width / height;
      const imageAspect = imageAspectRef.current;

      renderer.setSize(width, height);

      // Behavior similar to object-contain: fit image entirely within container
      const scale = Math.min(containerAspect / imageAspect, 1.0 / imageAspect);
      plane.scale.set(scale * imageAspect, scale, 1);

      // Position image at bottom of container
      const imageHeight = scale;
      const containerHeight = 1;
      const offsetY = (containerHeight - imageHeight) / 2;
      plane.position.y = -offsetY;

      const frustumHeight = 1;
      const frustumWidth = frustumHeight * containerAspect;
      camera.left = -frustumWidth / 2;
      camera.right = frustumWidth / 2;
      camera.top = frustumHeight / 2;
      camera.bottom = -frustumHeight / 2;
      camera.updateProjectionMatrix();

      uniforms.resolution.value.set(width, height, 1, 1);
    };

    const mouseState = {
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      vX: 0,
      vY: 0,
    };

    // Calculate actual image bounds within container (for object-contain behavior)
    const calculateImageBounds = () => {
      if (!container) return { imageX: 0, imageY: 0, imageWidth: 0, imageHeight: 0 };

      const containerRect = container.getBoundingClientRect();
      const imageAspect = imageAspectRef.current;
      const containerAspect = containerRect.width / containerRect.height;

      let imageWidth, imageHeight, imageX, imageY;

      if (containerAspect > imageAspect) {
        // Container is wider than image - image has full height, centered horizontally
        imageHeight = containerRect.height;
        imageWidth = imageHeight * imageAspect;
        imageX = (containerRect.width - imageWidth) / 2;
        imageY = 0;
      } else {
        // Container is taller than image - image has full width, positioned at bottom
        imageWidth = containerRect.width;
        imageHeight = imageWidth / imageAspect;
        imageX = 0;
        // Position at bottom (matching our CSS bottom-0)
        imageY = containerRect.height - imageHeight;
      }

      return { imageX, imageY, imageWidth, imageHeight };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const { imageX, imageY, imageWidth, imageHeight } = calculateImageBounds();

      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;

      // Check if mouse is over the actual image (not just the container)
      const isOverImage =
        relativeX >= imageX &&
        relativeX <= imageX + imageWidth &&
        relativeY >= imageY &&
        relativeY <= imageY + imageHeight;

      isHoveredRef.current = isOverImage;

      // Calculate normalized coordinates within the image bounds for distortion effect
      const x = (relativeX - imageX) / imageWidth;
      const y = 1 - (relativeY - imageY) / imageHeight;

      mouseState.vX = x - mouseState.prevX;
      mouseState.vY = y - mouseState.prevY;
      Object.assign(mouseState, { x, y, prevX: x, prevY: y });
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      dataTexture.needsUpdate = true;
      Object.assign(mouseState, {
        x: 0,
        y: 0,
        prevX: 0,
        prevY: 0,
        vX: 0,
        vY: 0,
      });
    };

    // Add global mouse move listener for better detection
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const { imageX, imageY, imageWidth, imageHeight } = calculateImageBounds();

      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;

      const isOverImage =
        relativeX >= imageX &&
        relativeX <= imageX + imageWidth &&
        relativeY >= imageY &&
        relativeY <= imageY + imageHeight;

      if (isOverImage) {
        handleMouseMove(e);
      } else {
        isHoveredRef.current = false;
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('resize', handleResize);
    handleResize();

    const animate = () => {
      requestAnimationFrame(animate);
      uniforms.time.value += 0.05;

      const data = dataTexture.image.data as Float32Array;

      // Always apply relaxation to return to normal state
      for (let i = 0; i < size * size; i++) {
        data[i * 4] *= relaxation;
        data[i * 4 + 1] *= relaxation;
      }

      // Check if we're in loading phase
      const currentTime = Date.now();
      const loadingElapsed = currentTime - loadingStartTime.current;
      const loadingProgress = Math.min(loadingElapsed / loadingDuration, 1);

      if (loadingProgress < 1) {
        isLoadingRef.current = true;
        if (Math.floor(loadingProgress * 10) !== Math.floor((loadingProgress - 0.1) * 10)) {
          console.warn(
            'GridDistortion: Loading progress:',
            Math.round(loadingProgress * 100) + '%'
          );
        }

        // Apply loading effects
        const centerX = size / 2;
        const centerY = size / 2;
        const loadingTime = uniforms.time.value * loadingSpeed;

        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            const index = 4 * (i + size * j);
            const x = (i - centerX) / size;
            const y = (j - centerY) / size;
            const distance = Math.sqrt(x * x + y * y);

            let effectStrength = 0;

            switch (loadingPattern) {
              case 'wave':
                effectStrength = Math.sin(loadingTime + distance * 10) * loadingStrength;
                break;
              case 'ripple':
                effectStrength =
                  Math.sin(loadingTime - distance * 15) * loadingStrength * (1 - distance);
                break;
              case 'chaos':
                effectStrength =
                  (Math.sin(loadingTime * 2 + i * 0.5) + Math.cos(loadingTime * 3 + j * 0.7)) *
                  loadingStrength;
                break;
            }

            // Apply transition from loading to normal
            const transitionFactor = 1 - Math.pow(loadingProgress, 2);
            effectStrength *= transitionFactor;

            data[index] += effectStrength * 50;
            data[index + 1] += effectStrength * Math.cos(loadingTime + distance * 8) * 50;
          }
        }
      } else {
        if (isLoadingRef.current) {
          console.warn(
            'GridDistortion: Loading phase completed at',
            new Date().toLocaleTimeString()
          );
        }
        isLoadingRef.current = false;

        // Apply normal hover-based distortion
        if (
          isHoveredRef.current &&
          (Math.abs(mouseState.vX) > 0.001 || Math.abs(mouseState.vY) > 0.001)
        ) {
          const gridMouseX = size * mouseState.x;
          const gridMouseY = size * mouseState.y;
          const maxDist = size * mouse;

          for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
              const distSq = Math.pow(gridMouseX - i, 2) + Math.pow(gridMouseY - j, 2);
              if (distSq < maxDist * maxDist) {
                const index = 4 * (i + size * j);
                const power = Math.min(maxDist / Math.sqrt(distSq), 10);
                data[index] += strength * 100 * mouseState.vX * power;
                data[index + 1] -= strength * 100 * mouseState.vY * power;
              }
            }
          }
        }
      }

      dataTexture.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      dataTexture.dispose();
      if (uniforms.uTexture.value) uniforms.uTexture.value.dispose();
    };
  }, [grid, mouse, strength, relaxation, imageSrc, isInitialized]);

  return <div ref={containerRef} className={`w-full h-full overflow-hidden ${className}`} />;
};

export default GridDistortion;
