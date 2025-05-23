import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
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
    const numberOfParticles = 50;
    
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
      
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.directionX = Math.random() * 2 - 1;
        this.directionY = Math.random() * 2 - 1;
        this.size = Math.random() * 5 + 1;
        
        // Use brand colors
        const colors = [
          'rgba(59, 130, 246, 0.5)', // Primary blue
          'rgba(139, 92, 246, 0.5)',  // Purple
          'rgba(16, 185, 129, 0.5)',  // Green
          'rgba(59, 130, 246, 0.3)',  // Light blue
          'rgba(139, 92, 246, 0.3)'   // Light purple
        ];
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speedModifier = Math.random() * 3;
      }

      // Method to draw individual particle
      draw() {
        const currentContext = canvasRef.current?.getContext('2d');
        if (!currentContext) return;
        
        currentContext.beginPath();
        currentContext.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        currentContext.fillStyle = this.color;
        currentContext.fill();
        
        // Optional: add connecting lines for a network effect
        this.connectParticles();
      }

      // Connect this particle to others with lines when they are close
      connectParticles() {
        const currentCanvas = canvasRef.current;
        const currentContext = currentCanvas?.getContext('2d');
        if (!currentCanvas || !currentContext) return;
        
        for (const p2 of particlesArray) {
          if (this === p2) continue; // Skip self
          
          const distance = ((this.x - p2.x) ** 2 + (this.y - p2.y) ** 2);
          const maxDistance = currentCanvas.width < 1000 ? 100 : 120;
          
          if (distance < maxDistance ** 2) {
            const opacity = 1 - (distance / (maxDistance ** 2));
            currentContext.strokeStyle = `rgba(133, 173, 229, ${opacity})`;
            currentContext.lineWidth = 0.8;
            currentContext.beginPath();
            currentContext.moveTo(this.x, this.y);
            currentContext.lineTo(p2.x, p2.y);
            currentContext.stroke();
          }
        }
      }

      // Update particle movement
      update() {
        const currentCanvas = canvasRef.current;
        if (!currentCanvas) return;
        
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
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            
            const directionX = forceDirectionX * force * this.speedModifier;
            const directionY = forceDirectionY * force * this.speedModifier;
            
            this.x -= directionX;
            this.y -= directionY;
          }
        }

        // Normal movement
        this.x += this.directionX * this.speedModifier / 2;
        this.y += this.directionY * this.speedModifier / 2;
        
        this.draw();
      }
    }

    // Generate particles
    function init() {
      const currentCanvas = canvasRef.current;
      if (!currentCanvas) return;
      
      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * currentCanvas.width;
        const y = Math.random() * currentCanvas.height;
        particlesArray.push(new Particle(x, y));
      }
    }

    // Animation loop
    function animate() {
      const currentCanvas = canvasRef.current;
      const currentContext = currentCanvas?.getContext('2d');
      if (!currentCanvas || !currentContext) return;
      
      requestAnimationFrame(animate);
      currentContext.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
      
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
      className="absolute top-0 left-0 w-full h-full -z-10 opacity-40"
    />
  );
};

export default AnimatedBackground;