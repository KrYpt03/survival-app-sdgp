import haversine from 'haversine-distance';
import { calculateDistance } from '../tracking.js';

describe('calculateDistance Function', () => {
  it('should calculate the distance between two points correctly', () => {
    // Test case 1: Two points very close to each other
    const lat1 = 52.520008;
    const lon1 = 13.404954;
    const lat2 = 52.520010;
    const lon2 = 13.404950;
    const distance1 = calculateDistance(lat1, lon1, lat2, lon2);
    // For very close points, we just verify distance is small
    expect(distance1).toBeLessThan(1);

    // Test case 2: Two points farther apart
    const lat3 = 34.0522;
    const lon3 = -118.2437;
    const lat4 = 37.7749;
    const lon4 = -122.4194;
    const distance2 = calculateDistance(lat3, lon3, lat4, lon4);
    // For farther points, we verify the order of magnitude is correct
    expect(distance2).toBeGreaterThan(500000); // Greater than 500km
    expect(distance2).toBeLessThan(600000);    // Less than 600km

    // Test case 3: Same point (distance should be 0)
    const lat5 = 40.7128;
    const lon5 = -74.0060;
    const distance3 = calculateDistance(lat5, lon5, lat5, lon5);
    expect(distance3).toBe(0);
  });

  it('should handle negative coordinates correctly', () => {
    const lat1 = -23.5505;
    const lon1 = -46.6333;
    const lat2 = -22.9068;
    const lon2 = -43.1729;
    const distance = calculateDistance(lat1, lon1, lat2, lon2);
    // For points with negative coordinates, we verify the order of magnitude
    expect(distance).toBeGreaterThan(350000); // Greater than 350km
    expect(distance).toBeLessThan(370000);    // Less than 370km
  });
});