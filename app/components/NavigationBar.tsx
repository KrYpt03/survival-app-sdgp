import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

const NavigationBar = () => {
  return (
    <View style={styles.buttonContainer}>
      <Link href="/welcomeScreen" asChild>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="home-outline" size={25} color="black" />
        </TouchableOpacity>
      </Link>
      <Link href="/activitiesBar" asChild>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="search-outline" size={25} color="black" />
        </TouchableOpacity>
      </Link>
      <Link href="/activitiesBar" asChild>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="compass-outline" size={25} color="black" />
        </TouchableOpacity>
      </Link>
      <Link href="/imageScanner" asChild>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="camera-outline" size={25} color="black" />
        </TouchableOpacity>
      </Link>
      <TouchableOpacity style={styles.button}>
        <Ionicons name="person-outline" size={25} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 5, // Stick it to the bottom
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#F6F0F8",
    borderRadius: 35,
    height: 70,
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    zIndex: 999,
  },
  button: {
    padding: 10,
  },
});

export default NavigationBar;
