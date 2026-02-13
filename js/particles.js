/**
 * Mouse-reactive particle system
 * Subtle, performant canvas animation for hero background
 */

(function() {
  'use strict';

  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    canvas.style.display = 'none';
    return;
  }

  // Configuration
  const config = {
    particleCount: 80,
    particleColor: 'rgba(90, 138, 106, 0.35)', // Warm muted green
    lineColor: 'rgba(90, 138, 106, 0.08)',
    particleRadius: 2,
    maxSpeed: 0.5,
    connectionDistance: 120,
    mouseInfluenceRadius: 150,
    mouseRepelStrength: 0.02
  };

  // State
  let particles = [];
  let mouse = { x: null, y: null };
  let animationId = null;
  let isVisible = true;

  // Resize canvas to fill container
  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Reinitialize particles on resize
    initParticles();
  }

  // Initialize particles
  function initParticles() {
    particles = [];
    const count = Math.min(config.particleCount, Math.floor((canvas.width * canvas.height) / 15000));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * config.maxSpeed,
        vy: (Math.random() - 0.5) * config.maxSpeed,
        radius: config.particleRadius * (0.5 + Math.random() * 0.5)
      });
    }
  }

  // Update particle positions
  function updateParticles() {
    particles.forEach(particle => {
      // Mouse interaction - gentle repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.mouseInfluenceRadius && distance > 0) {
          const force = (config.mouseInfluenceRadius - distance) / config.mouseInfluenceRadius;
          particle.vx += (dx / distance) * force * config.mouseRepelStrength;
          particle.vy += (dy / distance) * force * config.mouseRepelStrength;
        }
      }

      // Apply velocity with damping
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Gentle velocity damping
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      // Add slight random drift
      particle.vx += (Math.random() - 0.5) * 0.02;
      particle.vy += (Math.random() - 0.5) * 0.02;

      // Clamp velocity
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      if (speed > config.maxSpeed) {
        particle.vx = (particle.vx / speed) * config.maxSpeed;
        particle.vy = (particle.vy / speed) * config.maxSpeed;
      }

      // Wrap around edges
      if (particle.x < -10) particle.x = canvas.width + 10;
      if (particle.x > canvas.width + 10) particle.x = -10;
      if (particle.y < -10) particle.y = canvas.height + 10;
      if (particle.y > canvas.height + 10) particle.y = -10;
    });
  }

  // Draw particles and connections
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    ctx.strokeStyle = config.lineColor;
    ctx.lineWidth = 1;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.connectionDistance) {
          const opacity = 1 - (distance / config.connectionDistance);
          ctx.strokeStyle = `rgba(90, 138, 106, ${opacity * 0.12})`;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    ctx.fillStyle = config.particleColor;
    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Animation loop
  function animate() {
    if (!isVisible) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    updateParticles();
    draw();
    animationId = requestAnimationFrame(animate);
  }

  // Event handlers
  function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }

  function handleMouseLeave() {
    mouse.x = null;
    mouse.y = null;
  }

  function handleVisibilityChange() {
    isVisible = !document.hidden;
  }

  // Throttled resize handler
  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 100);
  }

  // Initialize
  function init() {
    resizeCanvas();

    // Event listeners
    window.addEventListener('resize', handleResize);
    canvas.parentElement.addEventListener('mousemove', handleMouseMove);
    canvas.parentElement.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start animation
    animate();
  }

  // Cleanup function (for potential SPA use)
  function destroy() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    window.removeEventListener('resize', handleResize);
    canvas.parentElement.removeEventListener('mousemove', handleMouseMove);
    canvas.parentElement.removeEventListener('mouseleave', handleMouseLeave);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose destroy function for cleanup
  window.particleSystem = { destroy };
})();
