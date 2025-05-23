import { useEffect, useRef } from 'react';

const InnovationBackground = () => {
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
    const numberOfParticles = 70;
    
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

    // Function to connect particles with lines
    function connectParticles() {
      const currentCanvas = canvasRef.current;
      const currentContext = currentCanvas?.getContext('2d');
      if (!currentCanvas || !currentContext) return;
      
      let opacityValue = 1;
      
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const p1 = particlesArray[a];
          const p2 = particlesArray[b];
          
          const distance = ((p1.x - p2.x) * (p1.x - p2.x)) + 
                          ((p1.y - p2.y) * (p1.y - p2.y));
          const maxDistance = (currentCanvas.width/7) * (currentCanvas.height/7);
          
          if (distance < maxDistance) {
            opacityValue = 1 - (distance/maxDistance);
            currentContext.strokeStyle = `rgba(133, 173, 229, ${opacityValue})`;
            currentContext.lineWidth = 1;
            currentContext.beginPath();
            currentContext.moveTo(p1.x, p1.y);
            currentContext.lineTo(p2.x, p2.y);
            currentContext.stroke();
          }
        }
      }
    }

    // Generate particles
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
      
      connectParticles();
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
      className="absolute top-0 left-0 w-full h-full -z-10 opacity-50"
    />
  );
};

export default InnovationBackground;