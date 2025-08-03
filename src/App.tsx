import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './App.css'

function App() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const cubesRef = useRef<THREE.Mesh[]>([])
  const frameIdRef = useRef<number>()

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 5
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0)
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, Math.PI / 2)
    scene.add(ambientLight)

    const spotLight = new THREE.SpotLight(0xffffff, Math.PI, Math.PI / 6, 1, 0)
    spotLight.position.set(10, 10, 10)
    scene.add(spotLight)

    const pointLight = new THREE.PointLight(0xffffff, Math.PI, 0, 0)
    pointLight.position.set(-10, -10, -10)
    scene.add(pointLight)

    // Create cubes
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material1 = new THREE.MeshStandardMaterial({ color: 0xffa500 })
    const material2 = new THREE.MeshStandardMaterial({ color: 0xffa500 })

    const cube1 = new THREE.Mesh(geometry, material1)
    cube1.position.x = -1.2
    scene.add(cube1)

    const cube2 = new THREE.Mesh(geometry, material2)
    cube2.position.x = 1.2
    scene.add(cube2)

    cubesRef.current = [cube1, cube2]

    // Mouse interaction
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    let hoveredCube: THREE.Mesh | null = null

    const onMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(cubesRef.current)

      // Reset previous hovered cube
      if (hoveredCube && !intersects.find(i => i.object === hoveredCube)) {
        (hoveredCube.material as THREE.MeshStandardMaterial).color.setHex(0xffa500)
        hoveredCube = null
      }

      // Set new hovered cube
      if (intersects.length > 0) {
        const newHoveredCube = intersects[0].object as THREE.Mesh
        if (newHoveredCube !== hoveredCube) {
          hoveredCube = newHoveredCube;
          (hoveredCube.material as THREE.MeshStandardMaterial).color.setHex(0xff69b4)
        }
      }
    }

    const onClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(cubesRef.current)

      if (intersects.length > 0) {
        const clickedCube = intersects[0].object as THREE.Mesh
        const currentScale = clickedCube.scale.x
        const newScale = currentScale === 1 ? 1.5 : 1
        clickedCube.scale.setScalar(newScale)
      }
    }

    // Basic orbit controls with mouse
    let isMouseDown = false
    let mouseX = 0
    let mouseY = 0

    const onMouseDown = (event: MouseEvent) => {
      if (event.button === 2) { // Right mouse button for rotation
        isMouseDown = true
        mouseX = event.clientX
        mouseY = event.clientY
      }
    }

    const onMouseUp = () => {
      isMouseDown = false
    }

    const onMouseMoveOrbit = (event: MouseEvent) => {
      if (!isMouseDown) return

      const deltaX = event.clientX - mouseX
      const deltaY = event.clientY - mouseY

      const spherical = new THREE.Spherical()
      spherical.setFromVector3(camera.position)
      spherical.theta -= deltaX * 0.01
      spherical.phi += deltaY * 0.01
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi))

      camera.position.setFromSpherical(spherical)
      camera.lookAt(0, 0, 0)

      mouseX = event.clientX
      mouseY = event.clientY
    }

    // Event listeners
    renderer.domElement.addEventListener('mousemove', onMouseMove)
    renderer.domElement.addEventListener('click', onClick)
    renderer.domElement.addEventListener('mousedown', onMouseDown)
    renderer.domElement.addEventListener('mouseup', onMouseUp)
    renderer.domElement.addEventListener('mousemove', onMouseMoveOrbit)
    renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault())

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate)

      // Rotate cubes
      cubesRef.current.forEach(cube => {
        cube.rotation.x += 0.01
      })

      renderer.render(scene, camera)
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current)
      }
      
      window.removeEventListener('resize', handleResize)
      
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('mousemove', onMouseMove)
        renderer.domElement.removeEventListener('click', onClick)
        renderer.domElement.removeEventListener('mousedown', onMouseDown)
        renderer.domElement.removeEventListener('mouseup', onMouseUp)
        renderer.domElement.removeEventListener('mousemove', onMouseMoveOrbit)
        renderer.domElement.removeEventListener('contextmenu', (e) => e.preventDefault())
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      
      // Dispose of Three.js objects
      geometry.dispose()
      material1.dispose()
      material2.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div className="App">
      <h1>React + Three.js</h1>
      <div className="canvas-container">
        <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      </div>
      <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        Click cubes to scale them. Right-click and drag to orbit around the scene.
      </p>
    </div>
  )
}

export default App
