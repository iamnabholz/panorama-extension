// Helper to parse any CSS color string into RGB values [0-255]
function parseColor(colorStr: string): [number, number, number] | null {
  if (!colorStr || colorStr === "none") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = colorStr;
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  return [data[0], data[1], data[2]];
}

// Calculate W3C relative luminance
function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Returns true if the background is dark (meaning white/light text has better contrast)
 */
export function isDarkBackground(colorStr: string): boolean {
  const rgb = parseColor(colorStr);
  if (!rgb) {
    // Fallback: check if system/theme is dark
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  const luminance = getLuminance(rgb[0], rgb[1], rgb[2]);
  // Standard threshold: luminance < 0.25 is generally dark
  return luminance < 0.25;
}
