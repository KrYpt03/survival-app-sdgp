// LocationProvider.tsx
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import * as Location from 'expo-location';
import { useAuth } from '@clerk/clerk-expo';
import { locationApi } from '../api/location';

// Type for location data
export type LocationData = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
} | null ;

// Type for context value
type LocationContextType = {
  location: LocationData;
};

// Create context
export const LocationContext = createContext<LocationContextType>({
  location: null,
});

// Props type for provider
type Props = {
  children: ReactNode;
};

// Provider component
export const LocationProvider: React.FC<Props> = ({ children }) => {
  const { userId } = useAuth();
  const [location, setLocation] = useState<LocationData>(null);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 2,
        },
        async (loc) => {
          const newLocation: LocationData = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            accuracy: loc.coords.accuracy || undefined,
            timestamp: loc.timestamp,
          };

          console.log("NEW_LOCATION", newLocation)

          setLocation(newLocation);

          if (userId) {
            await locationApi.updateUserLocation(userId, loc.coords.latitude, loc.coords.longitude);
          }
        }
      );
    };

    startTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  return (
    <LocationContext.Provider value={{ location }}>
      {children}
    </LocationContext.Provider>
  );
};