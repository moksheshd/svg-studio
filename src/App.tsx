import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './App.css'

function App() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null)
  const frameIdRef = useRef<number | null>(null)
  
  // Camera control states
  const zoomRef = useRef<number>(1)
  const isPanningRef = useRef<boolean>(false)
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const cameraPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

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

    // Mouse wheel zoom handler
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      
      const zoomSpeed = 0.001
      const delta = event.deltaY * zoomSpeed
      
      // Update zoom level (clamped between 0.1 and 10)
      zoomRef.current = Math.max(0.1, Math.min(10, zoomRef.current * (1 + delta)))
      
      // Update camera frustum based on zoom
      const aspect = mountRef.current!.clientWidth / mountRef.current!.clientHeight
      const frustumSize = 10 / zoomRef.current
      
      camera.left = (frustumSize * aspect) / -2
      camera.right = (frustumSize * aspect) / 2
      camera.top = frustumSize / 2
      camera.bottom = frustumSize / -2
      camera.updateProjectionMatrix()
    }
    
    // Mouse pan handlers
    const handleMouseDown = (event: MouseEvent) => {
      // Right click for pan
      if (event.button === 2) {
        event.preventDefault()
        isPanningRef.current = true
        panStartRef.current = { x: event.clientX, y: event.clientY }
      }
    }
    
    const handleMouseMove = (event: MouseEvent) => {
      if (isPanningRef.current && cameraRef.current) {
        const deltaX = event.clientX - panStartRef.current.x
        const deltaY = event.clientY - panStartRef.current.y
        
        // Calculate pan speed based on zoom level
        const panSpeed = 0.01 / zoomRef.current
        
        // Update camera position
        cameraPositionRef.current.x -= deltaX * panSpeed
        cameraPositionRef.current.y += deltaY * panSpeed
        
        cameraRef.current.position.x = cameraPositionRef.current.x
        cameraRef.current.position.y = cameraPositionRef.current.y
        cameraRef.current.lookAt(cameraPositionRef.current.x, cameraPositionRef.current.y, 0)
        
        // Update pan start position for next frame
        panStartRef.current = { x: event.clientX, y: event.clientY }
      }
    }
    
    const handleMouseUp = () => {
      isPanningRef.current = false
    }
    
    // Prevent context menu on right click
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault()
    }
    
    // Add event listeners
    const canvas = renderer.domElement
    canvas.addEventListener('wheel', handleWheel, { passive: false })
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mouseleave', handleMouseUp)
    canvas.addEventListener('contextmenu', handleContextMenu)

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
      const frustumSize = 10 / zoomRef.current
      
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
      
      // Remove camera control event listeners
      canvas.removeEventListener('wheel', handleWheel)
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mouseleave', handleMouseUp)
      canvas.removeEventListener('contextmenu', handleContextMenu)
      
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
