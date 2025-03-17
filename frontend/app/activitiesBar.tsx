
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // use MaterialIcons for Hiking ,Travel, Photography
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign'; // calendor icon
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { format } from 'date-fns';

import * as Location from 'expo-location';





const ActivitiesBar = () => {

  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [locationText, setLocationText] = useState<string | null>(null); // To store the city and country
  const [locationError, setLocationError] = useState<string | null>(null); // For error handling

  useEffect(() => {
    const today = new Date();
    const formattedDate = format(today, 'eeee dd'); // Format as 'Sunday 09'
    setCurrentDate(formattedDate);

  // Request location permissions and get the current location
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocationError('Permission to access location was denied');
      return;
    }

    // Get current location
    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation.coords);

    // Reverse geocoding to get city and country
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
  };

  getLocation(); // Call the function to get the location
}, []);




  return (
    <View style={styles.container}>
      <StatusBar style="inverted" />
      <ScrollView>
        {/* Location and Date/Members */}
        <View style={styles.header}>
          <View style={styles.location}>
            <View style={styles.dot} />
            <View>
              {/* Displaying the current location */}
              {locationText ? (
                <Text style={styles.locationText}>{locationText}</Text>
              ) : (
                <Text style={styles.locationText}>Location: Loading...</Text>
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

        {/* Activity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity</Text>
          <View style={styles.activityIcons}>
            {/* Replace with your icon components/images */}
            <View style={styles.activityIcon}>
              <MaterialIcons style={styles.activityIconStyle} name="hiking" size={30} color="black" />
              <Text style={styles.activityLabel}>Hike</Text>
            </View>
            <View style={styles.activityIcon}>
              {/* <MaterialIcons name="tent" size={30} color="black" /> */}
              <MaterialCommunityIcons style={styles.activityIconStyle} name="tent" size={30} color="black" />
              <Text style={styles.activityLabel}>Camping</Text>
            </View>
            <View style={styles.activityIcon}>
              <MaterialIcons style={styles.activityIconStyle} name="directions-bus" size={30} color="black" />
              <Text style={styles.activityLabel}>Travel</Text>
            </View>
            <View style={styles.activityIcon}>
              <MaterialIcons style={styles.activityIconStyle} name="camera-alt" size={30} color="black" />
              <Text style={styles.activityLabel}>Photo</Text>
            </View>
          </View>
        </View>

        {/* Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          <View style={styles.servicesGrid}>
            {/* Replace with your image components/images */}
            <View style={styles.serviceItem}>
              <Image source={require('../assets/images/Equipments.png')} style={styles.serviceImageEquepments} />
              <Text style={styles.serviceLabel}>Equipments</Text>
            </View>
            <View style={styles.serviceItem}>
              <Image source={require('../assets/images/Tracks.png')} style={styles.serviceImageTracks} />
              <Text style={styles.serviceLabel}>Tracks</Text>
            </View>
            <View style={styles.serviceItem}>
              <Image source={require('../assets/images/Guide.png')} style={styles.serviceImageGuide} />
              <Text style={styles.serviceLabel}>Guide</Text>
            </View>
            <View style={styles.serviceItem}>
              <View style={styles.weatherContainer}>
                <Text style={styles.weatherTemp}>25°</Text>
                <Text style={styles.weatherLabel}>Weather</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonSection}>
        <View style={styles.buttonContainer}>
          <Link href="/welcomeScreen" asChild>
            <TouchableOpacity style={styles.button}>
              <Ionicons name="home-outline" size={25} color="black" />
            </TouchableOpacity>
          </Link>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="search-outline" size={25} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="compass-outline" size={25} color="black" />
          </TouchableOpacity>
          <Link href="/imageScanner" asChild>
            <TouchableOpacity style={styles.button}>
              <Ionicons name="camera-outline" size={25} color="black" />
            </TouchableOpacity>
          </Link>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="person-outline" size={25} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonSection: {
    marginTop: 10,
    marginBottom: 0,
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 0
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
    // fontFamily: 'TimesNewRoman',
    color:'#4682B4',
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
    marginBottom: 20,
    marginTop: 10,
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
    // width: 50,
    // height: 50,
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
    width: '48%', // Adjust as needed
    marginBottom: 10,
    alignItems: 'center',
  },
  serviceImageEquepments: {
    width: '100%',
    height: 130, // Adjust as needed
    borderRadius: 15,
  },
  serviceImageTracks: {
    width: '100%',
    height: 180, // Adjust as needed
    borderRadius: 15,
  },
  serviceImageGuide: {
    width: '100%',
    height: 160, // Adjust as needed
    borderRadius: 15,
  },
  serviceLabel: {
    marginTop: 4,
  },
  weatherContainer: {
    backgroundColor: '#13274F', // Or your desired color
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  weatherTemp: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  weatherLabel: {
    marginTop: 4,
    color:'white',
  },

  buttonContainer: {
    position: "absolute",
    bottom: 0, // Changed bottom to 0
    left: 0, // Changed left to 0
    right: 0, // Changed right to 0
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#F6F0F8",
    borderRadius: 30,
    height: 70,
    elevation: 5, // Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginTop: 10,
    
  },
  button: {
    padding: 10,
  },
});

export default ActivitiesBar;
