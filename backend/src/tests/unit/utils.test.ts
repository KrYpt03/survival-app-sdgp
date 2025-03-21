/**
 * Unit tests for utility functions
 */

import { formatBytes } from '../../infrastructure/utils/formatting.js';
import { getRandomString } from '../../infrastructure/utils/strings.js';

describe('formatBytes', () => {
  it('should format 0 bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
  });
  
  it('should format bytes correctly', () => {
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(1048576)).toBe('1 MB');
    expect(formatBytes(1073741824)).toBe('1 GB');
  });
  
  it('should use the specified number of decimals', () => {
    expect(formatBytes(1536, 0)).toBe('2 KB');
    expect(formatBytes(1536, 1)).toBe('1.5 KB');
    expect(formatBytes(1536, 3)).toBe('1.5 KB');
  });
});

describe('getRandomString', () => {
  it('should generate a string of the specified length', () => {
    expect(getRandomString(10).length).toBe(10);
    expect(getRandomString(20).length).toBe(20);
    expect(getRandomString(0).length).toBe(0);
  });
  
  it('should contain only valid characters', () => {
    const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomString = getRandomString(100);
    
    for (let i = 0; i < randomString.length; i++) {
      expect(validChars).toContain(randomString[i]);
    }
  });
  
  it('should generate different strings on each call', () => {
    const string1 = getRandomString(20);
    const string2 = getRandomString(20);
    
    expect(string1).not.toBe(string2);
  });
}); 