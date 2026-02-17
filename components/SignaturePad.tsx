import React, { useRef, useEffect, useCallback } from 'react';

interface SignaturePadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  height?: number;
  className?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  value,
  onChange,
  label = 'Assinatura do paciente',
  height = 140,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawingRef = useRef(false);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = '100%';
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.strokeStyle = '#240110';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#fdf3f5';
    ctx.fillRect(0, 0, rect.width, height);

    // Restaurar assinatura salva (após init ou resize)
    if (value?.startsWith('data:image')) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, height);
      };
      img.src = value;
    }
  }, [height, value]);

  useEffect(() => {
    initCanvas();
    const ro = new ResizeObserver(initCanvas);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [initCanvas]);

  const getPoint = (e: React.PointerEvent | PointerEvent) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return null;
    const rect = container.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.PointerEvent) => {
    e.preventDefault();
    const point = getPoint(e);
    if (!point) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  };

  const draw = (e: React.PointerEvent) => {
    if (!isDrawingRef.current) return;
    const point = getPoint(e);
    if (!point) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      onChange(dataUrl);
    } catch {
      // ignore
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.fillStyle = '#fdf3f5';
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    onChange('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-xs font-medium text-brand-600 uppercase tracking-wide">{label}</label>
      <div
        ref={containerRef}
        className="relative border-2 border-brand-200 rounded-lg bg-brand-50 overflow-hidden"
        style={{ minHeight: height }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          onPointerCancel={stopDrawing}
          style={{ touchAction: 'none', cursor: 'crosshair', display: 'block' }}
        />
        <button
          type="button"
          onClick={handleClear}
          className="absolute bottom-2 right-2 px-3 py-1 text-xs font-medium text-brand-600 hover:text-brand-800 bg-white/90 hover:bg-brand-200 border border-brand-200 rounded transition-colors shadow-sm"
        >
          Limpar
        </button>
      </div>
      <p className="text-xs text-brand-500">Assine com o dedo, mouse ou caneta digital</p>
    </div>
  );
};
