import fs from 'fs';
import path from 'path';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

function processImage(inputFileName, outputFileName) {
  const inputPath = path.resolve('public/assets', inputFileName);
  const outputPath = path.resolve('public/assets', outputFileName);

  console.log(`Processing ${inputPath}...`);
  const jpegData = fs.readFileSync(inputPath);
  const rawImageData = jpeg.decode(jpegData, { useTolerantUnknown: true });

  const { width, height, data } = rawImageData;

  const png = new PNG({ width, height });

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Detect white/near-white/light-grey background pixels
      // Luminance / brightness calculation
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // Calculate color saturation / difference from white
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const diff = maxC - minC;

      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;

      // If very bright (white/cream background) and low saturation -> make transparent
      if (brightness > 230 && diff < 25) {
        png.data[idx + 3] = 0; // Fully transparent
      } else if (brightness > 200 && diff < 35) {
        // Soft alpha transition for smooth edges
        const alpha = Math.round(((230 - brightness) / 30) * 255);
        png.data[idx + 3] = Math.max(0, Math.min(255, alpha));
      } else {
        png.data[idx + 3] = 255; // Opaque
      }
    }
  }

  const buffer = PNG.sync.write(png);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Saved transparent PNG to ${outputPath} (${width}x${height})`);
}

processImage('flor1.jpeg', 'flor1.png');
processImage('flor2.jpeg', 'flor2.png');
