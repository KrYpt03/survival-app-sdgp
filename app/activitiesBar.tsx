import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { StatusBar } from 'expo-status-bar';
import { format } from 'date-fns';
import NavigationBar from './components/NavigationBar';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types and Interfaces
interface LocationState {
  latitude: number;
  longitude: number;
}

interface WeatherData {
  temp: number;
  condition: string;
}

interface ActivityIconProps {
  icon: React.ReactNode;
  label: string;
}

interface ServiceItemProps {
  image?: any;
  label: string;
  children?: React.ReactNode;
}

const LOCATION_PERMISSION_KEY = 'location_permission_status';

// Weather Component
const WeatherDisplay: React.FC<{
  weatherData: WeatherData | null;
  weatherLoading: boolean;
  weatherError: string | null;
  onRetry: () => void;
}> = ({ weatherData, weatherLoading, weatherError, onRetry }) => {
  const getWeatherIcon = (condition: string) => {
    const iconProps = { size: 40, color: "white" };
    const icons = {
      clear: <MaterialCommunityIcons name="weather-sunny" {...iconProps} />,
      fog: <MaterialCommunityIcons name="weather-fog" {...iconProps} />,
      clouds: <MaterialCommunityIcons name="weather-cloudy" {...iconProps} />,
      rain: <MaterialCommunityIcons name="weather-rainy" {...iconProps} />,
      snow: <MaterialCommunityIcons name="weather-snowy" {...iconProps} />,
      thunderstorm: <MaterialCommunityIcons name="weather-lightning" {...iconProps} />,
      default: <MaterialCommunityIcons name="weather-partly-cloudy" {...iconProps} />
    };
    return icons[condition.toLowerCase() as keyof typeof icons] || icons.default;
  };

  if (weatherLoading) {
    return (
      <View style={styles.weatherContainer}>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.weatherText}>Loading weather...</Text>
      </View>
    );
  }

  if (weatherError) {
    return (
      <View style={styles.weatherContainer}>
        <MaterialIcons name="error-outline" size={40} color="white" />
        <Text style={styles.weatherText}>{weatherError}</Text>
        <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!weatherData) {
    return (
      <View style={styles.weatherContainer}>
        <Text style={styles.weatherText}>No weather data</Text>
        <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Fetch Weather</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.weatherContainer}>
      {getWeatherIcon(weatherData.condition)}
      <Text style={styles.weatherTemp}>{weatherData.temp}°C</Text>
      <Text style={styles.weatherCondition}>{weatherData.condition}</Text>
    </View>
  );
};

// Activity Icon Component
const ActivityIcon: React.FC<ActivityIconProps> = ({ icon, label }) => (
  <View style={styles.activityIcon}>
    <View style={styles.activityIconStyle}>{icon}</View>
    <Text style={styles.activityLabel}>{label}</Text>
  </View>
);

// Service Item Component
const ServiceItem: React.FC<ServiceItemProps> = ({ image, label, children }) => (
  <View style={styles.serviceItem}>
    {image ? (
      <Image source={image} style={styles.serviceImage} />
    ) : (
      children
    )}
    <Text style={styles.serviceLabel}>{label}</Text>
  </View>
);

const ActivitiesBar: React.FC = () => {
  const [currentDate, setCurrentDate] = React.useState<string | null>(null);
  const [location, setLocation] = React.useState<LocationState | null>(null);
  const [locationText, setLocationText] = React.useState<string | null>(null);
  const [locationError, setLocationError] = React.useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = React.useState<string | null>(null);
  const [weatherData, setWeatherData] = React.useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = React.useState<boolean>(false);
  const [weatherError, setWeatherError] = React.useState<string | null>(null);

  const checkLocationPermission = async () => {
    try {
      const storedStatus = await AsyncStorage.getItem(LOCATION_PERMISSION_KEY);
      
      if (storedStatus === 'granted') {
        setPermissionStatus('granted');
        fetchLocation();
        return true;
      }
      
      const { status } = await Location.getForegroundPermissionsAsync();
      setPermissionStatus(status);
      await AsyncStorage.setItem(LOCATION_PERMISSION_KEY, status);
      
      if (status === 'granted') {
        fetchLocation();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking location permission:', error);
      return false;
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      await AsyncStorage.setItem(LOCATION_PERMISSION_KEY, status);
      
      if (status === 'granted') {
        fetchLocation();
        return true;
      }
      setLocationError('Permission to access location was denied');
      return false;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLocationError('Error requesting location permission');
      return false;
    }
  };

  const fetchLocation = async () => {
    try {
      setLocationError(null);
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    
      const locationData = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    
      if (locationData.length > 0) {
        const { city, country } = locationData[0];
        setLocationText(`${city},\n${country}`);
      } else {
        setLocationText('Location not found');
      }

      fetchWeatherData(currentLocation.coords.latitude, currentLocation.coords.longitude);
    } catch (error) {
      console.error('Location error:', error);
      setLocationError('Error getting location data');
    }
  };

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    try {
      setWeatherLoading(true);
      setWeatherError(null);
      
      const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=celsius`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API Error (${response.status})`);
      }
      
      const data = await response.json();
      
      if (data?.current) {
        const weatherCode = data.current.weather_code;
        const condition = getWeatherCondition(weatherCode);
        
        setWeatherData({
          temp: Math.round(data.current.temperature_2m),
          condition
        });
      } else {
        throw new Error('Invalid data structure from API');
      }
    } catch (error: any) {
      setWeatherError(error.name === 'AbortError' ? 'Request timed out' : `Error: ${error.message}`);
    } finally {
      setWeatherLoading(false);
    }
  };

  const getWeatherCondition = (code: number): string => {
    if (code <= 3) return 'Clear';
    if (code <= 49) return 'Fog';
    if (code <= 69) return 'Rain';
    if (code <= 79) return 'Snow';
    if (code <= 99) return 'Thunderstorm';
    return 'Clear';
  };

  React.useEffect(() => {
    const today = new Date();
    setCurrentDate(format(today, 'eeee dd'));
    checkLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <View style={styles.location}>
            <View style={styles.dot} />
            <View>
              {permissionStatus !== 'granted' ? (
                <View>
                  <Text style={styles.locationText}>Location access needed</Text>
                  <TouchableOpacity 
                    style={styles.permissionButton} 
                    onPress={requestLocationPermission}
                  >
                    <Text style={styles.permissionButtonText}>Allow Location</Text>
                  </TouchableOpacity>
                </View>
              ) : locationError ? (
                <View>
                  <Text style={styles.locationText}>{locationError}</Text>
                  <TouchableOpacity 
                    style={styles.permissionButton} 
                    onPress={fetchLocation}
                  >
                    <Text style={styles.permissionButtonText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.locationText}>
                  {locationText || "Location: Loading..."}
                </Text>
              )}
            </View>
          </View>
        </View>
        
        <View style={styles.info}>
          <TouchableOpacity style={styles.infoButton}>
            <AntDesign name="calendar" size={18} color="black" />
            <Text style={styles.infoText}>{currentDate || "Loading..."}</Text> 
          </TouchableOpacity>
          <TouchableOpacity style={styles.infoButton}>
            <MaterialIcons name="people" size={18} color="black" />
            <Text style={styles.infoText}>Members - 10</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity</Text>
          <View style={styles.activityIcons}>
            <ActivityIcon 
              icon={<MaterialIcons name="hiking" size={30} color="black" />}
              label="Hike"
            />
            <ActivityIcon 
              icon={<MaterialCommunityIcons name="tent" size={30} color="black" />}
              label="Camping"
            />
            <ActivityIcon 
              icon={<MaterialIcons name="directions-bus" size={30} color="black" />}
              label="Travel"
            />
            <ActivityIcon 
              icon={<MaterialIcons name="camera-alt" size={30} color="black" />}
              label="Photo"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          <View style={styles.servicesGrid}>
            <ServiceItem
              image={require('../assets/images/Equipments.png')}
              label="Equipments"
            />
            <ServiceItem
              image={require('../assets/images/Tracks.png')}
              label="Tracks"
            />
            <ServiceItem
              image={require('../assets/images/Guide.png')}
              label="Guide"
            />
            <ServiceItem label="Weather">
              <WeatherDisplay
                weatherData={weatherData}
                weatherLoading={weatherLoading}
                weatherError={weatherError}
                onRetry={() => location && fetchWeatherData(location.latitude, location.longitude)}
              />
            </ServiceItem>
          </View>
        </View>
      </ScrollView>

      <NavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 0,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: 'lightgray',
    marginRight: 8,
  },
  locationText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4682B4',
  },
  permissionButton: {
    marginTop: 5,
    padding: 8,
    backgroundColor: '#4682B4',
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
  },
  info: {
    flexDirection: 'row',
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 15,
    padding: 5,
  },
  infoText: {
    marginLeft: 4,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  activityIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  activityIcon: {
    alignItems: 'center',
    padding: 10,
  },
  activityIconStyle: {
    borderRadius: 20,
    padding: 15,
    backgroundColor: 'lightgray',
  },
  activityLabel: {
    marginTop: 4,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
  },
  serviceImage: {
    width: '100%',
    height: 150,
    borderRadius: 15,
    resizeMode: 'cover',
  },
  serviceLabel: {
    marginTop: 4,
    padding: 5,
    backgroundColor: '#202E5C',
    borderRadius: 15,
    color: 'white',
  },
  weatherContainer: {
    backgroundColor: '#13274F',
    width: '100%',
    height: 130,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  weatherTemp: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  weatherCondition: {
    fontSize: 16,
    color: 'white',
    marginTop: 2,
  },
  weatherText: {
    fontSize: 16,
    color: 'white',
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
  },
});

export default ActivitiesBar;