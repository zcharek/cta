import { useEffect, useRef } from 'react';

const PremiumBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const currentCanvas = canvasRef.current;
      if (!currentCanvas) return;
      
      currentCanvas.width = window.innerWidth;
      currentCanvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle properties
    const particlesArray: Particle[] = [];
    const numberOfParticles = 80;
    
    // Mouse position for interactive effect
    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 150
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Create particle class
    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;
      speedModifier: number;
      originalSize: number;
      
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.directionX = Math.random() * 2 - 1;
        this.directionY = Math.random() * 2 - 1;
        this.size = Math.random() * 4 + 1;
        this.originalSize = this.size;
        
        // Use professional colors
        const colors = [
          'rgba(59, 130, 246, 0.6)', // Primary blue
          'rgba(99, 102, 241, 0.6)',  // Indigo
          'rgba(16, 185, 129, 0.6)',  // Green
          'rgba(59, 130, 246, 0.4)',  // Light blue
          'rgba(139, 92, 246, 0.4)'   // Light purple
        ];
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speedModifier = Math.random() * 2 + 0.5;
      }

      // Method to draw individual particle
      draw() {
        if (!canvasRef.current || !canvasRef.current.getContext('2d')) return;
        const currentCtx = canvasRef.current.getContext('2d')!;
        
        currentCtx.beginPath();
        currentCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        currentCtx.fillStyle = this.color;
        currentCtx.fill();
      }

      // Update particle movement
      update() {
        if (!canvasRef.current) return;
        const currentCanvas = canvasRef.current;
        
        if (this.x > currentCanvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > currentCanvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // Mouse interaction - push particles away
        if (mouse.x && mouse.y) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            // Increase size when near mouse
            this.size = this.originalSize * 1.5;
            
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            
            const directionX = forceDirectionX * force * this.speedModifier;
            const directionY = forceDirectionY * force * this.speedModifier;
            
            this.x -= directionX;
            this.y -= directionY;
          } else {
            // Return to original size
            if (this.size > this.originalSize) {
              this.size -= 0.1;
            }
          }
        }

        // Normal movement
        this.x += this.directionX * this.speedModifier / 2;
        this.y += this.directionY * this.speedModifier / 2;
        
        this.draw();
      }
    }
    
    // Connect particles with lines
    function connectParticles() {
      if (!canvasRef.current || !canvasRef.current.getContext('2d')) return;
      const currentCanvas = canvasRef.current;
      const currentCtx = currentCanvas.getContext('2d')!;
      
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const distance = 
            ((particlesArray[a].x - particlesArray[b].x) ** 2) +
            ((particlesArray[a].y - particlesArray[b].y) ** 2);
          
          const maxDistance = (currentCanvas.width/7) * (currentCanvas.height/7);
          
          if (distance < maxDistance) {
            const opacity = 1 - (distance/maxDistance);
            currentCtx.strokeStyle = `rgba(133, 173, 229, ${opacity})`;
            currentCtx.lineWidth = 1;
            currentCtx.beginPath();
            currentCtx.moveTo(particlesArray[a].x, particlesArray[a].y);
            currentCtx.lineTo(particlesArray[b].x, particlesArray[b].y);
            currentCtx.stroke();
          }
        }
      }
    }

    // Generate particles
    function init() {
      if (!canvasRef.current) return;
      const currentCanvas = canvasRef.current;
      
      particlesArray.length = 0;
      
      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * currentCanvas.width;
        const y = Math.random() * currentCanvas.height;
        particlesArray.push(new Particle(x, y));
      }
    }

    // Create subtle background gradient
    function drawBackground() {
      if (!canvasRef.current || !canvasRef.current.getContext('2d')) return;
      const currentCanvas = canvasRef.current;
      const currentCtx = currentCanvas.getContext('2d')!;
      
      // Create gradient
      const gradient = currentCtx.createLinearGradient(0, 0, 0, currentCanvas.height);
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.8)');
      gradient.addColorStop(1, 'rgba(30, 41, 59, 0.8)');
      
      // Fill with gradient
      currentCtx.fillStyle = gradient;
      currentCtx.fillRect(0, 0, currentCanvas.width, currentCanvas.height);
    }

    // Animation loop
    function animate() {
      if (!canvasRef.current || !canvasRef.current.getContext('2d')) return;
      const currentCanvas = canvasRef.current;
      const currentCtx = currentCanvas.getContext('2d')!;
      
      requestAnimationFrame(animate);
      
      // Draw subtle background
      drawBackground();
      
      // Update particles and draw connections
      connectParticles();
      
      for (const particle of particlesArray) {
        particle.update();
      }
    }

    init();
    animate();

    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default PremiumBackground;