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

    // Particle properties - réduit pour de meilleures performances
    const particlesArray: Particle[] = [];
    const numberOfParticles = 40;
    
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
        
        // All blue colors with increased intensity
        const colors = [
          'rgba(37, 99, 235, 0.8)',   // Strong blue
          'rgba(59, 130, 246, 0.8)',  // Primary blue
          'rgba(96, 165, 250, 0.8)',  // Bright blue
          'rgba(37, 99, 235, 0.6)',   // Medium blue
          'rgba(147, 197, 253, 0.7)'  // Light blue
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
            // Enhanced mouse interaction with size scaling and color intensity
            // Increase size when near mouse - more dramatic effect
            this.size = this.originalSize * 2.2;
            
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            
            // Stronger push effect for more interactivity
            const pushIntensity = 1.8;
            const directionX = forceDirectionX * force * this.speedModifier * pushIntensity;
            const directionY = forceDirectionY * force * this.speedModifier * pushIntensity;
            
            this.x -= directionX;
            this.y -= directionY;
            
            // Make the color more vibrant on hover by increasing opacity
            this.color = this.color.replace(/[\d.]+(?=\))/, '0.95');
          } else {
            // Smooth transition back to original size
            if (this.size > this.originalSize) {
              this.size -= 0.15;
            }
            
            // Return color to original opacity more gradually
            if (this.color.includes('0.95')) {
              const originalOpacity = [0.8, 0.8, 0.8, 0.6, 0.7][Math.floor(Math.random() * 5)];
              this.color = this.color.replace(/[\d.]+(?=\))/, originalOpacity.toString());
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
          
          const maxDistance = (currentCanvas.width/9) * (currentCanvas.height/9);
          
          if (distance < maxDistance) {
            const opacity = 1 - (distance/maxDistance);
            // Brighter blue connection lines
            currentCtx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            currentCtx.lineWidth = 1.2;
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

    // Create clean white background
    function drawBackground() {
      if (!canvasRef.current || !canvasRef.current.getContext('2d')) return;
      const currentCanvas = canvasRef.current;
      const currentCtx = currentCanvas.getContext('2d')!;
      
      // Fill with white
      currentCtx.fillStyle = 'rgba(255, 255, 255, 1)';
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