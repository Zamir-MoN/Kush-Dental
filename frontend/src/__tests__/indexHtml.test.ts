import { describe, it, expect } from 'vitest';
// @ts-ignore
import * as fs from 'fs';
// @ts-ignore
import * as path from 'path';

describe('index.html Security Regression', () => {
  it('does not contain inline event handlers for font loading', () => {
    // @ts-ignore
    const indexPath = path.resolve(__dirname, '../../index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');
    
    // Check that we no longer use onload="this.media='all'"
    expect(content).not.toContain('onload=');
    expect(content).not.toContain('this.media');
    
    // Sanity check to ensure it still has fonts
    expect(content).toContain('fonts.googleapis.com/css2');
  });
});
