const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertSvgToPng() {
  const svgPath = path.join(__dirname, '../public/logo.svg');
  const pngPath = path.join(__dirname, '../public/logo.png');
  
  try {
    // Read SVG
    const svgBuffer = fs.readFileSync(svgPath);
    
    // Convert to PNG with high quality, maintaining aspect ratio
    await sharp(svgBuffer)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
      })
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(pngPath);
    
    console.log('✅ Logo converted successfully: logo.png');
    console.log('   Size: 512x512px (maintains aspect ratio, transparent background)');
  } catch (error) {
    console.error('❌ Error converting logo:', error);
    process.exit(1);
  }
}

convertSvgToPng();

