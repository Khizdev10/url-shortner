import sharp from 'sharp';
import { renameSync, statSync } from 'fs';

await sharp('app/icon.png')
    .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('app/icon_resized.png');

renameSync('app/icon_resized.png', 'app/icon.png');
console.log('Done! New size:', statSync('app/icon.png').size, 'bytes');
