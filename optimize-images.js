// Script to optimize images using sharp
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Source and target directories
const sourceDir = path.join(__dirname, 'public/images');
const targetDir = path.join(__dirname, 'public/images/optimized');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Image optimization settings
const webpOptions = {
  quality: 80,
  effort: 6,  // 0 (fastest) to 6 (slowest)
};

const avifOptions = {
  quality: 60,
  effort: 4,  // 0 (fastest) to 9 (slowest)
};

// Function to process an image file
async function processImage(filePath) {
  const filename = path.basename(filePath);
  const ext = path.extname(filename).toLowerCase();
  const baseName = path.basename(filename, ext);
  
  console.log(`Processing: ${filename}`);
  
  // Skip if not an image
  if (!['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
    console.log(`Skipping: ${filename} (not a supported image format)`);
    return;
  }
  
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Get dimensions
    const { width, height } = metadata;
    
    // Create WebP version
    await image
      .webp(webpOptions)
      .toFile(path.join(targetDir, `${baseName}.webp`));
    
    // Create AVIF version
    await image
      .avif(avifOptions)
      .toFile(path.join(targetDir, `${baseName}.avif`));
    
    // Create a resized version for smaller screens
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

// Function to recursively scan directory for images
async function scanDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    
    if (fs.statSync(fullPath).isDirectory()) {
      // Create the same directory structure in the target
      const relativePath = path.relative(sourceDir, fullPath);
      const newDir = path.join(targetDir, relativePath);
      
      if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir, { recursive: true });
      }
      
      // Recursively scan subdirectory
      await scanDirectory(fullPath);
    } else {
      // Process image file
      await processImage(fullPath);
    }
  }
}

// Start optimization
console.log('Starting image optimization...');
scanDirectory(sourceDir)
  .then(() => console.log('Image optimization complete!'))
  .catch(err => console.error('Error during optimization:', err));