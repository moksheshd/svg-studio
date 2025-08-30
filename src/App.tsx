import React, { useEffect, useRef, useState, useCallback } from 'react'
import './App.css'
import { SceneManager } from './core/SceneManager'
import { SVGProcessor } from './core/SVGProcessor'
import { ResizeHandles } from './components/ResizeHandles'
import * as THREE from 'three'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneManagerRef = useRef<SceneManager | null>(null)
  const svgProcessorRef = useRef<SVGProcessor | null>(null)
  const resizeHandlesRef = useRef<ResizeHandles | null>(null)
  const frameIdRef = useRef<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster())
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2())
  const currentSVGGroupRef = useRef<THREE.Group | null>(null)
  
  // UI state
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadedSVG, setLoadedSVG] = useState<string | null>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  
  // Camera control states
  const isPanningRef = useRef<boolean>(false)
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // Initialize scene
  useEffect(() => {
    if (!canvasRef.current) return

    // Initialize managers
    const sceneManager = new SceneManager(canvasRef.current)
    sceneManagerRef.current = sceneManager
    
    const svgProcessor = new SVGProcessor()
    svgProcessorRef.current = svgProcessor
    
    const resizeHandles = new ResizeHandles()
    resizeHandlesRef.current = resizeHandles
    
    // Add resize handles to the scene
    resizeHandles.getHandles().forEach(handle => {
      sceneManager.handleGroup.add(handle)
    })

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate)
      sceneManager.render()
    }
    animate()

    // Mouse wheel zoom handler
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      sceneManager.updateZoom(event.deltaY)
    }
    
    // Mouse pan handlers
    const handleMouseDown = (event: MouseEvent) => {
      if (!sceneManagerRef.current || !resizeHandlesRef.current) return
      
      // Update mouse position
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      
      // Check for left click
      if (event.button === 0) {
        raycasterRef.current.setFromCamera(mouseRef.current, sceneManagerRef.current.camera)
        
        // First check if clicking on resize handles (if selected)
        if (isSelected) {
          const handles = resizeHandlesRef.current.getHandles()
          const handleIntersects = raycasterRef.current.intersectObjects(handles)
          
          if (handleIntersects.length > 0) {
            event.preventDefault()
            const handle = handleIntersects[0].object as THREE.Mesh
            const worldPos = handleIntersects[0].point
            
            resizeHandlesRef.current.startResize(handle, new THREE.Vector2(worldPos.x, worldPos.y))
            setIsResizing(true)
            return
          }
        }
        
        // Check if clicking on the SVG
        if (currentSVGGroupRef.current) {
          const svgObjects: THREE.Object3D[] = []
          currentSVGGroupRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
              svgObjects.push(child)
            }
          })
          
          const svgIntersects = raycasterRef.current.intersectObjects(svgObjects)
          
          if (svgIntersects.length > 0) {
            // Select the SVG and show resize handles
            if (!isSelected) {
              resizeHandlesRef.current.attachToGroup(currentSVGGroupRef.current)
              
              // Add bounding box to scene
              const boundingBoxLines = resizeHandlesRef.current.getBoundingBoxLines()
              if (boundingBoxLines) {
                sceneManagerRef.current.handleGroup.add(boundingBoxLines)
              }
              
              setIsSelected(true)
            }
          } else {
            // Clicked outside - deselect
            if (isSelected && !isResizing) {
              resizeHandlesRef.current.detach()
              
              // Remove bounding box from scene
              const boundingBoxLines = resizeHandlesRef.current.getBoundingBoxLines()
              if (boundingBoxLines && boundingBoxLines.parent) {
                sceneManagerRef.current.handleGroup.remove(boundingBoxLines)
              }
              
              setIsSelected(false)
            }
          }
        }
      }
      
      // Right click for pan
      if (event.button === 2) {
        event.preventDefault()
        isPanningRef.current = true
        panStartRef.current = { x: event.clientX, y: event.clientY }
      }
    }
    
    const handleMouseMove = (event: MouseEvent) => {
      if (!sceneManagerRef.current) return
      
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      
      // Handle resize dragging
      if (isResizing && resizeHandlesRef.current) {
        // Create a plane at z=0 for raycasting
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
        raycasterRef.current.setFromCamera(mouseRef.current, sceneManagerRef.current.camera)
        
        // Get intersection with the plane
        const worldPos = new THREE.Vector3()
        raycasterRef.current.ray.intersectPlane(plane, worldPos)
        
        // Update resize with shift key for aspect ratio
        resizeHandlesRef.current.updateResize(
          new THREE.Vector2(worldPos.x, worldPos.y),
          !event.shiftKey // Maintain aspect ratio unless shift is held
        )
        return
      }
      
      // Handle panning
      if (isPanningRef.current && sceneManagerRef.current) {
        const deltaX = event.clientX - panStartRef.current.x
        const deltaY = event.clientY - panStartRef.current.y
        
        sceneManagerRef.current.updatePan(deltaX, deltaY)
        
        // Update pan start position for next frame
        panStartRef.current = { x: event.clientX, y: event.clientY }
        return
      }
      
      // Highlight resize handles on hover (only if selected)
      if (isSelected && resizeHandlesRef.current && !isResizing && !isPanningRef.current) {
        raycasterRef.current.setFromCamera(mouseRef.current, sceneManagerRef.current.camera)
        const handles = resizeHandlesRef.current.getHandles()
        const intersects = raycasterRef.current.intersectObjects(handles)
        
        if (intersects.length > 0) {
          const handle = intersects[0].object as THREE.Mesh
          resizeHandlesRef.current.highlightHandle(handle)
          canvas.style.cursor = resizeHandlesRef.current.getActiveHandleCursor() || 'pointer'
        } else {
          resizeHandlesRef.current.highlightHandle(null)
          canvas.style.cursor = 'default'
        }
      }
    }
    
    const handleMouseUp = () => {
      isPanningRef.current = false
      
      if (isResizing && resizeHandlesRef.current) {
        resizeHandlesRef.current.endResize()
        setIsResizing(false)
        canvas.style.cursor = 'default'
      }
    }
    
    // Prevent context menu on right click
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault()
    }

    // Handle window resize
    const handleResize = () => {
      if (!canvasRef.current || !sceneManagerRef.current) return
      sceneManagerRef.current.handleResize(
        canvasRef.current.clientWidth,
        canvasRef.current.clientHeight
      )
    }

    // Add event listeners
    const canvas = sceneManager.renderer.domElement
    canvas.addEventListener('wheel', handleWheel, { passive: false })
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mouseleave', handleMouseUp)
    canvas.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current)
      }
      
      canvas.removeEventListener('wheel', handleWheel)
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mouseleave', handleMouseUp)
      canvas.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('resize', handleResize)
      
      sceneManager.dispose()
    }
  }, [])

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  // Handle SVG file loading
  const handleSVGFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.svg')) {
      setError('Please select a valid SVG file')
      setTimeout(() => setError(null), 3000)
      return
    }

    if (!sceneManagerRef.current || !svgProcessorRef.current) {
      setError('Scene not initialized')
      return
    }

    try {
      // Clear existing SVG
      sceneManagerRef.current.clearSVG()
      
      // Load and process new SVG
      const result = await svgProcessorRef.current.loadSVGFile(file)
      
      // Scale to fit viewport
      svgProcessorRef.current.scaleToFit(result.group, 5)
      
      // Add to scene
      sceneManagerRef.current.svgGroup.add(result.group)
      currentSVGGroupRef.current = result.group
      
      // Deselect any previous selection
      if (resizeHandlesRef.current && isSelected) {
        resizeHandlesRef.current.detach()
        const boundingBoxLines = resizeHandlesRef.current.getBoundingBoxLines()
        if (boundingBoxLines && boundingBoxLines.parent) {
          sceneManagerRef.current.handleGroup.remove(boundingBoxLines)
        }
        setIsSelected(false)
      }
      
      setLoadedSVG(file.name)
      setError(null)
      console.log('SVG loaded successfully:', file.name)
    } catch (err) {
      console.error('Error loading SVG:', err)
      setError(err instanceof Error ? err.message : 'Failed to load SVG')
      setTimeout(() => setError(null), 5000)
    }
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setError(null)

    const files = Array.from(e.dataTransfer.files)
    const svgFile = files.find(file => file.name.toLowerCase().endsWith('.svg'))

    if (!svgFile) {
      setError('Please drop a valid SVG file')
      setTimeout(() => setError(null), 3000)
      return
    }

    await handleSVGFile(svgFile)
  }, [handleSVGFile])

  // Handle file input change
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleSVGFile(file)
    }
  }, [handleSVGFile])

  // Trigger file input click
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div 
      className="App" 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        margin: 0, 
        padding: 0, 
        overflow: 'hidden',
        position: 'relative'
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <canvas 
        ref={canvasRef}
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'block'
        }} 
      />
      
      {/* Drag overlay */}
      {isDragging && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(74, 144, 226, 0.1)',
          border: '3px dashed #4a90e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ margin: 0, color: '#4a90e2' }}>Drop SVG file here</h2>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '10px 20px',
          backgroundColor: '#ff4444',
          color: 'white',
          borderRadius: '4px',
          zIndex: 1001
        }}>
          {error}
        </div>
      )}
      
      {/* Status and Upload Button */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        padding: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#666',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div>
          <div>Controls: Mouse wheel to zoom, Right-click drag to pan</div>
          {loadedSVG && (
            <>
              <div>Loaded: {loadedSVG}</div>
              <div style={{ fontSize: '11px', marginTop: '4px', color: '#888' }}>
                {isSelected ? 
                  'Drag corners to resize • Hold Shift for free resize • Click outside to deselect' : 
                  'Click on SVG to select and resize'}
              </div>
            </>
          )}
          {!loadedSVG && <div>Drag & drop an SVG file or click upload</div>}
        </div>
        
        {/* Upload Button */}
        <button
          onClick={handleUploadClick}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#357abd'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4a90e2'
          }}
        >
          <span style={{ fontSize: '18px' }}>+</span> Upload SVG
        </button>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".svg"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}

export default App
