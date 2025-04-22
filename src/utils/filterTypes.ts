export interface FilterSettings {
  scanlines: number;     // 0-1: intensity of scanlines effect
  rgbShift: number;      // 0-5: amount of RGB channel shift
  noise: number;         // 0-1: intensity of noise/static
  bloom: number;         // 0-1: intensity of light bloom effect
  vignette: number;      // 0-1: intensity of vignette (dark edges)
  curvature: number;     // 0-1: screen curvature amount
  brightness: number;    // 0.5-1.5: image brightness
  contrast: number;      // 0.5-2: image contrast
  saturation: number;    // 0-2: color saturation
  flickering: number;    // 0-1: screen flicker intensity
}

export const defaultFilterSettings: FilterSettings = {
  scanlines: 0.3,
  rgbShift: 1.5,
  noise: 0.1,
  bloom: 0.2,
  vignette: 0.3,
  curvature: 0.2,
  brightness: 1.0,
  contrast: 1.1,
  saturation: 1.1,
  flickering: 0.1
};