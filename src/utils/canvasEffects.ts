import { FilterSettings } from './filterTypes';

let lastFrameTime = 0;
let flickerValue = 1.0;

export function applyCRTEffect(
  ctx: CanvasRenderingContext2D, 
  settings: FilterSettings,
  width: number,
  height: number
) {
  // Save the original image data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.putImageData(imageData, 0, 0);
  
  // Clear the main canvas
  ctx.clearRect(0, 0, width, height);
  
  // Apply color adjustments (brightness, contrast, saturation)
  applyColorAdjustments(tempCtx, settings, width, height);
  
  // Apply RGB shift effect
  if (settings.rgbShift > 0) {
    applyRGBShift(ctx, tempCtx, settings.rgbShift, width, height);
  } else {
    // If no RGB shift, just draw the adjusted image
    ctx.drawImage(tempCanvas, 0, 0);
  }
  
  // Apply bloom effect
  if (settings.bloom > 0) {
    applyBloom(ctx, settings.bloom, width, height);
  }
  
  // Apply screen curvature
  if (settings.curvature > 0) {
    applyCurvature(ctx, settings.curvature, width, height);
  }
  
  // Apply vignette effect
  if (settings.vignette > 0) {
    applyVignette(ctx, settings.vignette, width, height);
  }
  
  // Apply scan lines
  if (settings.scanlines > 0) {
    applyScanLines(ctx, settings.scanlines, width, height);
  }
  
  // Apply noise
  if (settings.noise > 0) {
    applyNoise(ctx, settings.noise, width, height);
  }
  
  // Apply flickering
  if (settings.flickering > 0) {
    applyFlickering(ctx, settings.flickering, width, height);
  }
}

function applyColorAdjustments(
  ctx: CanvasRenderingContext2D,
  settings: FilterSettings,
  width: number,
  height: number
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    // Convert RGB to HSL
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }
    
    // Adjust saturation
    s = Math.min(1, Math.max(0, s * settings.saturation));
    
    // Convert back to RGB
    let r1, g1, b1;
    
    if (s === 0) {
      r1 = g1 = b1 = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r1 = hueToRgb(p, q, h + 1/3);
      g1 = hueToRgb(p, q, h);
      b1 = hueToRgb(p, q, h - 1/3);
    }
    
    // Apply brightness and contrast
    r1 = ((r1 * 255) - 128) * settings.contrast + 128;
    g1 = ((g1 * 255) - 128) * settings.contrast + 128;
    b1 = ((b1 * 255) - 128) * settings.contrast + 128;
    
    r1 *= settings.brightness;
    g1 *= settings.brightness;
    b1 *= settings.brightness;
    
    // Clamp and assign
    data[i] = Math.min(255, Math.max(0, r1));
    data[i + 1] = Math.min(255, Math.max(0, g1));
    data[i + 2] = Math.min(255, Math.max(0, b1));
  }
  
  ctx.putImageData(imageData, 0, 0);
}

function hueToRgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1/6) return p + (q - p) * 6 * t;
  if (t < 1/2) return q;
  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
}

function applyRGBShift(
  ctx: CanvasRenderingContext2D,
  sourceCtx: CanvasRenderingContext2D,
  intensity: number,
  width: number,
  height: number
) {
  // Calculate the shift amount
  const shift = Math.floor(intensity);
  
  // Create separate canvases for R, G, B channels
  const rCanvas = document.createElement('canvas');
  const gCanvas = document.createElement('canvas');
  const bCanvas = document.createElement('canvas');
  
  rCanvas.width = gCanvas.width = bCanvas.width = width;
  rCanvas.height = gCanvas.height = bCanvas.height = height;
  
  const rCtx = rCanvas.getContext('2d')!;
  const gCtx = gCanvas.getContext('2d')!;
  const bCtx = bCanvas.getContext('2d')!;
  
  // Draw the source image to each channel canvas
  rCtx.drawImage(sourceCtx.canvas, 0, 0);
  gCtx.drawImage(sourceCtx.canvas, 0, 0);
  bCtx.drawImage(sourceCtx.canvas, 0, 0);
  
  // Extract and zero out the other channels
  isolateChannel(rCtx, width, height, 'r');
  isolateChannel(gCtx, width, height, 'g');
  isolateChannel(bCtx, width, height, 'b');
  
  // Draw with channel shifting
  ctx.globalCompositeOperation = 'lighter';
  
  // Red channel - shifted left
  ctx.drawImage(rCanvas, -shift, 0);
  
  // Green channel - no shift
  ctx.drawImage(gCanvas, 0, 0);
  
  // Blue channel - shifted right
  ctx.drawImage(bCanvas, shift, 0);
  
  ctx.globalCompositeOperation = 'source-over';
}

function isolateChannel(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  channel: 'r' | 'g' | 'b'
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    if (channel === 'r') {
      // Keep red, zero out others
      data[i + 1] = 0;
      data[i + 2] = 0;
    } else if (channel === 'g') {
      // Keep green, zero out others
      data[i] = 0;
      data[i + 2] = 0;
    } else if (channel === 'b') {
      // Keep blue, zero out others
      data[i] = 0;
      data[i + 1] = 0;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

function applyScanLines(
  ctx: CanvasRenderingContext2D,
  intensity: number,
  width: number,
  height: number
) {
  const scanLineHeight = 2; // Height of each scan line
  const gap = 2; // Gap between scan lines
  const alpha = intensity * 0.8; // Alpha of the scan lines
  
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  
  for (let y = 0; y < height; y += scanLineHeight + gap) {
    ctx.fillRect(0, y, width, scanLineHeight);
  }
}

function applyNoise(
  ctx: CanvasRenderingContext2D,
  intensity: number,
  width: number,
  height: number
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const intensityScaled = intensity * 30;
  
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * intensityScaled;
    
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  
  ctx.putImageData(imageData, 0, 0);
}

function applyVignette(
  ctx: CanvasRenderingContext2D,
  intensity: number,
  width: number,
  height: number
) {
  // Create radial gradient for vignette
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.sqrt(width * width + height * height) / 2
  );
  
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity * 0.8})`);
  
  ctx.fillStyle = gradient;
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';
}

function applyBloom(
  ctx: CanvasRenderingContext2D,
  intensity: number, 
  width: number,
  height: number
) {
  // Create a copy of the current canvas
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.drawImage(ctx.canvas, 0, 0);
  
  // Apply blur
  tempCtx.filter = `blur(${intensity * 10}px)`;
  tempCtx.drawImage(tempCanvas, 0, 0);
  tempCtx.filter = 'none';
  
  // Threshold the image to keep only bright areas
  const imageData = tempCtx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const threshold = 200;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const brightness = (r + g + b) / 3;
    
    if (brightness < threshold) {
      data[i] = data[i + 1] = data[i + 2] = 0;
      data[i + 3] = 0;
    }
  }
  
  tempCtx.putImageData(imageData, 0, 0);
  
  // Overlay the bloom effect
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = intensity;
  ctx.drawImage(tempCanvas, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
}

function applyCurvature(
  ctx: CanvasRenderingContext2D,
  intensity: number,
  width: number,
  height: number
) {
  // Create a temporary canvas to hold the original image
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.drawImage(ctx.canvas, 0, 0);
  
  // Clear the main canvas
  ctx.clearRect(0, 0, width, height);
  
  // Apply the curvature distortion
  const curveAmount = intensity * 0.2;
  
  // Draw the image with distortion
  for (let y = 0; y < height; y++) {
    const v = y / height;
    const dy = (v - 0.5) * 2;
    const dist = Math.abs(dy);
    const stretch = 1 + (dist * dist * curveAmount);
    
    // Distort horizontally
    const scaledWidth = width / stretch;
    const offsetX = (width - scaledWidth) / 2;
    
    ctx.drawImage(
      tempCanvas,
      0, y, width, 1,
      offsetX, y, scaledWidth, 1
    );
  }
}

function applyFlickering(
  ctx: CanvasRenderingContext2D,
  intensity: number,
  width: number,
  height: number
) {
  // Calculate flickering based on time
  const now = Date.now();
  if (now - lastFrameTime > 50) { // Update flicker value every 50ms
    // Random fluctuation in brightness
    const flickerRange = intensity * 0.3;
    flickerValue = 1.0 - (Math.random() * flickerRange);
    lastFrameTime = now;
  }
  
  if (flickerValue < 1.0) {
    // Apply the flicker effect by reducing brightness
    ctx.fillStyle = `rgba(0, 0, 0, ${1.0 - flickerValue})`;
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
  }
}