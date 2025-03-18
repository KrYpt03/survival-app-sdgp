import haversine from 'haversine-distance';
import { calculateDistance } from '../tracking';

describe('calculateDistance Function', () => {
  it('should calculate the distance between two points correctly', () => {
    // Test case 1: Two points very close to each other
    const lat1 = 52.520008;
    const lon1 = 13.404954;
    const lat2 = 52.520010;
    const lon2 = 13.404950;
    const distance1 = calculateDistance(lat1, lon1, lat2, lon2);
    const expectedDistance1 = haversine({ latitude: lat1, longitude: lon1 }, { latitude: lat2, longitude: lon2 });
    expect(distance1).toBeCloseTo(expectedDistance1, 2);

    // Test case 2: Two points farther apart
    const lat3 = 34.0522;
    const lon3 = -118.2437;
    const lat4 = 37.7749;
    const lon4 = -122.4194;
    const distance2 = calculateDistance(lat3, lon3, lat4, lon4);
    const expectedDistance2 = haversine({ latitude: lat3, longitude: lon3 }, { latitude: lat4, longitude: lon4 });
    expect(distance2).toBeCloseTo(expectedDistance2, 1);

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
    const expectedDistance = haversine({ latitude: lat1, longitude: lon1 }, { latitude: lat2, longitude: lon2 });
    expect(distance).toBeCloseTo(expectedDistance, 1);
  });
});