import React, { useEffect, useRef, useState, useCallback } from 'react'
import './App.css'
import { SceneManager } from './core/SceneManager'
import { SVGProcessor } from './core/SVGProcessor'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneManagerRef = useRef<SceneManager | null>(null)
  const svgProcessorRef = useRef<SVGProcessor | null>(null)
  const frameIdRef = useRef<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // UI state
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadedSVG, setLoadedSVG] = useState<string | null>(null)
  
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

    // Add a test SVG to start with
    const testSVG = svgProcessor.createTestSVG()
    sceneManager.svgGroup.add(testSVG)

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
      // Right click for pan
      if (event.button === 2) {
        event.preventDefault()
        isPanningRef.current = true
        panStartRef.current = { x: event.clientX, y: event.clientY }
      }
    }
    
    const handleMouseMove = (event: MouseEvent) => {
      if (isPanningRef.current && sceneManagerRef.current) {
        const deltaX = event.clientX - panStartRef.current.x
        const deltaY = event.clientY - panStartRef.current.y
        
        sceneManagerRef.current.updatePan(deltaX, deltaY)
        
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
          {loadedSVG && <div>Loaded: {loadedSVG}</div>}
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
