import React, { useEffect, useRef } from 'react';

interface WaterWaveFlowProps {
  className?: string;
  glowOpacity?: number;
}

export const WaterWaveFlow: React.FC<WaterWaveFlowProps> = ({
  className = '',
  glowOpacity = 0.8,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse tracking for fluid interactive ripple
    const mouse = {
      targetX: -1000,
      targetY: -1000,
      currentX: -1000,
      currentY: -1000,
      intensity: 0,
      targetIntensity: 0,
    };

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);
    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.targetIntensity = 1.0;
    };

    const handleMouseLeave = () => {
      mouse.targetIntensity = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    let startTime = performance.now();

    const render = (now: number) => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const t = (now - startTime) * 0.0015; // smooth liquid time

      // Smooth mouse interpolation
      mouse.currentX += (mouse.targetX - mouse.currentX) * 0.08;
      mouse.currentY += (mouse.targetY - mouse.currentY) * 0.08;
      mouse.intensity += (mouse.targetIntensity - mouse.intensity) * 0.05;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Helper function to calculate fluid water height
      const getWaveY = (
        x: number,
        baseYRatio: number,
        freq1: number,
        speed1: number,
        amp1: number,
        freq2: number,
        speed2: number,
        amp2: number,
        freq3: number,
        speed3: number,
        amp3: number,
        phase: number = 0
      ) => {
        const baseY = height * baseYRatio;
        // Superposition of trochoidal/sine harmonics
        let y =
          baseY +
          Math.sin(x * freq1 - t * speed1 + phase) * amp1 +
          Math.sin(x * freq2 - t * speed2 + phase * 1.5) * amp2 +
          Math.cos(x * freq3 - t * speed3 + phase * 0.7) * amp3;

        // Interactive ripple disturbance around mouse cursor
        if (mouse.intensity > 0.01) {
          const dx = x - mouse.currentX;
          const dy = baseY - mouse.currentY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 280) {
            const rippleDamping = Math.exp(-(dist * dist) / (110 * 110));
            const ripple = Math.sin(dist * 0.055 - t * 8.5) * rippleDamping * 16 * mouse.intensity;
            y += ripple;
          }
        }

        return y;
      };

      // Gradient for liquid gold stroke
      const strokeGrad = ctx.createLinearGradient(0, 0, width, 0);
      strokeGrad.addColorStop(0, 'rgba(220, 165, 27, 0.1)');
      strokeGrad.addColorStop(0.15, 'rgba(220, 165, 27, 0.75)');
      strokeGrad.addColorStop(0.5, 'rgba(253, 230, 138, 0.95)');
      strokeGrad.addColorStop(0.85, 'rgba(220, 165, 27, 0.75)');
      strokeGrad.addColorStop(1, 'rgba(220, 165, 27, 0.1)');

      const step = Math.max(3, Math.floor(width / 220));

      // --- 1. Draw Layer 1: Upper Fluid Water Wave (Behind Headline) ---
      // 1A. Liquid Volumetric Translucent Body
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width + step; x += step) {
        const y = getWaveY(x, 0.28, 0.0032, 1.8, 22, 0.007, 2.7, 9, 0.0016, 0.9, 7, 0);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      const fillGrad1 = ctx.createLinearGradient(0, height * 0.2, 0, height * 0.7);
      fillGrad1.addColorStop(0, 'rgba(220, 165, 27, 0.045)');
      fillGrad1.addColorStop(1, 'rgba(220, 165, 27, 0)');
      ctx.fillStyle = fillGrad1;
      ctx.fill();

      // 1B. Primary Flowing Water Crest Line (Glow + Crisp Line)
      ctx.beginPath();
      for (let x = 0; x <= width + step; x += step) {
        const y = getWaveY(x, 0.28, 0.0032, 1.8, 22, 0.007, 2.7, 9, 0.0016, 0.9, 7, 0);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.shadowColor = 'rgba(220, 165, 27, 0.55)';
      ctx.shadowBlur = 12 * glowOpacity;
      ctx.strokeStyle = strokeGrad;
      ctx.lineWidth = 2.0;
      ctx.stroke();

      // 1C. Echo Water Ripple Line
      ctx.beginPath();
      for (let x = 0; x <= width + step; x += step) {
        const y = getWaveY(x, 0.28, 0.0032, 1.8, 22, 0.007, 2.7, 9, 0.0016, 0.9, 7, 0) + 16 + Math.sin(x * 0.006 - t * 2.5) * 4;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(220, 165, 27, 0.3)';
      ctx.lineWidth = 1.0;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // --- 2. Draw Layer 2: Subtle Mid-Current Liquid Ripple ---
      ctx.beginPath();
      for (let x = 0; x <= width + step; x += step) {
        const y = getWaveY(x, 0.48, 0.0024, 1.3, 14, 0.0055, 2.1, 7, 0.0012, 0.7, 5, 2.4);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(220, 165, 27, 0.22)';
      ctx.lineWidth = 1.0;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // --- 3. Draw Layer 3: Lower Fluid Water Swell (Framing Subscription Box) ---
      // 3A. Translucent Water Underbody
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width + step; x += step) {
        const y = getWaveY(x, 0.66, 0.0028, 1.5, 24, 0.006, 2.4, 10, 0.0014, 0.8, 8, 3.7);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      const fillGrad2 = ctx.createLinearGradient(0, height * 0.6, 0, height);
      fillGrad2.addColorStop(0, 'rgba(220, 165, 27, 0.04)');
      fillGrad2.addColorStop(1, 'rgba(220, 165, 27, 0)');
      ctx.fillStyle = fillGrad2;
      ctx.fill();

      // 3B. Primary Lower Water Wave Line
      ctx.beginPath();
      for (let x = 0; x <= width + step; x += step) {
        const y = getWaveY(x, 0.66, 0.0028, 1.5, 24, 0.006, 2.4, 10, 0.0014, 0.8, 8, 3.7);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.shadowColor = 'rgba(220, 165, 27, 0.55)';
      ctx.shadowBlur = 12 * glowOpacity;
      ctx.strokeStyle = strokeGrad;
      ctx.lineWidth = 2.0;
      ctx.stroke();

      // 3C. Secondary Echo Water Ripple
      ctx.beginPath();
      for (let x = 0; x <= width + step; x += step) {
        const y = getWaveY(x, 0.66, 0.0028, 1.5, 24, 0.006, 2.4, 10, 0.0014, 0.8, 8, 3.7) + 18 + Math.cos(x * 0.005 - t * 2.2) * 5;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(220, 165, 27, 0.28)';
      ctx.lineWidth = 1.0;
      ctx.setLineDash([5, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [glowOpacity]);

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
};
