import { useEffect, useRef } from 'react';

const EnhancedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to fill the window
    const resizeCanvas = () => {
      const currentCanvas = canvasRef.current;
      if (!currentCanvas) return;
      
      currentCanvas.width = window.innerWidth;
      currentCanvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system properties
    const particlesArray: Particle[] = [];
    const numberOfParticles = 100; // Increased number of particles
    
    // Mouse interaction
    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 180
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Particle class with enhanced properties
    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;
      speedModifier: number;
      opacity: number;
      pulse: number;
      pulseDirection: number;
      
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.directionX = (Math.random() * 2) - 1;
        this.directionY = (Math.random() * 2) - 1;
        this.size = Math.random() * 6 + 1;
        
        // Enhanced color palette
        const colors = [
          'rgba(59, 130, 246, 0.7)', // Primary blue (brighter)
          'rgba(139, 92, 246, 0.7)',  // Purple (brighter)
          'rgba(16, 185, 129, 0.7)',  // Green (brighter)
          'rgba(236, 72, 153, 0.6)',  // Pink
          'rgba(245, 158, 11, 0.6)'   // Amber
        ];
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speedModifier = Math.random() * 3 + 0.5;
        
        // Added properties for pulsing effect
        this.opacity = Math.random() * 0.5 + 0.3;
        this.pulse = Math.random() * 0.02 + 0.01;
        this.pulseDirection = 1;
      }

      // Draw with glowing effect
      draw() {
        const currentContext = canvasRef.current?.getContext('2d');
        if (!currentContext) return;
        
        // Pulsing size effect
        this.size += this.pulse * this.pulseDirection;
        if (this.size > 8 || this.size < 1) {
          this.pulseDirection *= -1;
        }
        
        // Draw with gradient for glow effect
        const gradient = currentContext.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 2
        );
        
        // Extract base color and create transparent version
        const baseColor = this.color.replace(/[^,]+(?=\))/, '0');
        
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, baseColor);
        
        currentContext.beginPath();
        currentContext.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
        currentContext.fillStyle = gradient;
        currentContext.globalAlpha = this.opacity;
        currentContext.fill();
        currentContext.globalAlpha = 1;
      }

      // Update position and handle interactions
      update() {
        const currentCanvas = canvasRef.current;
        if (!currentCanvas) return;
        
        // Boundary check and direction change
        if (this.x > currentCanvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > currentCanvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // Enhanced mouse interaction with attraction/repulsion
        if (mouse.x && mouse.y) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            
            // Particles closer to the center are pushed away more strongly
            const pushFactor = 2;
            const directionX = forceDirectionX * force * this.speedModifier * pushFactor;
            const directionY = forceDirectionY * force * this.speedModifier * pushFactor;
            
            this.x -= directionX;
            this.y -= directionY;
            
            // Increase opacity when interacting with mouse
            this.opacity = Math.min(this.opacity + 0.02, 0.9);
          } else {
            // Gradually return to original opacity
            this.opacity = Math.max(this.opacity - 0.01, 0.3);
          }
        }

        // Movement with slight acceleration
        this.x += this.directionX * this.speedModifier / 2;
        this.y += this.directionY * this.speedModifier / 2;
        
        this.draw();
      }
    }

    // Advanced connection system with gradient lines
    function connectParticles() {
      const currentCanvas = canvasRef.current;
      const currentContext = currentCanvas?.getContext('2d');
      if (!currentCanvas || !currentContext) return;
      
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const p1 = particlesArray[a];
          const p2 = particlesArray[b];
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = currentCanvas.width / 5;
          
          if (distance < maxDistance) {
            // Create gradient line between particles
            const gradient = currentContext.createLinearGradient(
              p1.x, p1.y, p2.x, p2.y
            );
            
            // Calculate opacity based on distance
            const opacity = 1 - (distance / maxDistance);
            
            // Use simple rgba colors with calculated opacity
            const color1 = p1.color.replace(/[\d.]+(?=\))/, opacity.toFixed(2));
            const color2 = p2.color.replace(/[\d.]+(?=\))/, opacity.toFixed(2));
            
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);
            
            currentContext.strokeStyle = gradient;
            currentContext.lineWidth = Math.max((maxDistance - distance) / maxDistance * 2, 0.2);
            
            currentContext.beginPath();
            currentContext.moveTo(p1.x, p1.y);
            currentContext.lineTo(p2.x, p2.y);
            currentContext.stroke();
          }
        }
      }
    }

    // Generate initial particles
    function init() {
      const currentCanvas = canvasRef.current;
      if (!currentCanvas) return;
      
      particlesArray.length = 0;
      
      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * currentCanvas.width;
        const y = Math.random() * currentCanvas.height;
        particlesArray.push(new Particle(x, y));
      }
    }

    // Animation loop with subtle background color
    function animate() {
      const currentCanvas = canvasRef.current;
      const currentContext = currentCanvas?.getContext('2d');
      if (!currentCanvas || !currentContext) return;
      
      // Create subtle gradient background
      const bgGradient = currentContext.createLinearGradient(
        0, 0, currentCanvas.width, currentCanvas.height
      );
      bgGradient.addColorStop(0, 'rgba(8, 8, 30, 0.8)');
      bgGradient.addColorStop(1, 'rgba(15, 23, 42, 0.8)');
      
      // Clear with gradient
      currentContext.fillStyle = bgGradient;
      currentContext.fillRect(0, 0, currentCanvas.width, currentCanvas.height);
      
      // Update particles and connections
      for (const particle of particlesArray) {
        particle.update();
      }
      
      connectParticles();
      
      requestAnimationFrame(animate);
    }

    // Initialize and start animation
    init();
    animate();

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default EnhancedBackground;