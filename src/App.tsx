import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './App.css'

function App() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null)
  const frameIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f5f5)
    sceneRef.current = scene

    // Camera setup - OrthographicCamera for 2D workspace
    const aspect = mountRef.current.clientWidth / mountRef.current.clientHeight
    const frustumSize = 10
    const camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,  // left
      (frustumSize * aspect) / 2,   // right
      frustumSize / 2,               // top
      frustumSize / -2,              // bottom
      0.1,                           // near
      1000                           // far
    )
    camera.position.set(0, 0, 10)  // Position camera looking down at XY plane
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Basic lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    scene.add(directionalLight)

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current) return
      
      const aspect = mountRef.current.clientWidth / mountRef.current.clientHeight
      const frustumSize = 10
      
      cameraRef.current.left = (frustumSize * aspect) / -2
      cameraRef.current.right = (frustumSize * aspect) / 2
      cameraRef.current.top = frustumSize / 2
      cameraRef.current.bottom = frustumSize / -2
      cameraRef.current.updateProjectionMatrix()
      
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current)
      }
      
      window.removeEventListener('resize', handleResize)
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      
      renderer.dispose()
    }
  }, [])

  return (
    <div className="App" style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

export default App
