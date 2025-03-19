declare module 'haversine-distance' {
  interface Point {
    latitude: number;
    longitude: number;
  }

  function haversine(point1: Point, point2: Point): number;
  export default haversine;
} 