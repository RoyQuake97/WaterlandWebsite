import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Source and target directories
const sourceDir = path.join(rootDir, 'attached_assets');
const targetDir = path.join(rootDir, 'public/images/optimized');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Image optimization settings
const webpOptions = { 
  quality: 80,
  effort: 6, 
};

const avifOptions = { 
  quality: 60,
  effort: 4, 
};

// Process an image
async function processImage(filePath: string) {
  const filename = path.basename(filePath);
  const ext = path.extname(filename).toLowerCase();
  
  // Skip if not an image
  if (!['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
    return;
  }
  
  const baseName = path.basename(filename, ext);
  
  console.log(`Processing: ${filename}`);
  
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Get dimensions
    const { width = 1200, height = 800 } = metadata;
    
    // Create WebP version
    await image
      .webp(webpOptions)
      .toFile(path.join(targetDir, `${baseName}.webp`));
    
    // Create AVIF version
    await image
      .avif(avifOptions)
      .toFile(path.join(targetDir, `${baseName}.avif`));
    
    // Create a resized version for smaller screens (max 800px width)
    if (width > 800) {
      await image
        .resize({ width: 800 })
        .webp(webpOptions)
        .toFile(path.join(targetDir, `${baseName}-800.webp`));
    }
    
    // Create thumbnail version for lazyloading
    await image
      .resize({ width: Math.floor(width / 10) })
      .blur(3)
      .webp({ quality: 30 })
      .toFile(path.join(targetDir, `${baseName}-thumb.webp`));
    
    console.log(`Optimized: ${filename}`);
  } catch (error) {
    console.error(`Error processing ${filename}:`, error);
  }
}

// Process all images in the directory
async function processDirectory() {
  try {
    const files = fs.readdirSync(sourceDir);
    
    for (const file of files) {
      const filePath = path.join(sourceDir, file);
      
      // Skip if not a file
      if (!fs.statSync(filePath).isFile()) continue;
      
      await processImage(filePath);
    }
    
    console.log('All images optimized successfully!');
  } catch (error) {
    console.error('Error processing images:', error);
  }
}

// Run the script
processDirectory();