import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'

const ImageScanner = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="inverted" />
      <Image source={require('../assets/images/imageScn.png')} style={styles.image} />
      <TouchableOpacity style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.flashButton}>
        <Ionicons name="flash" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.geminiButton}>
        <Ionicons name="scan" size={35} color="white" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
  flashButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
  geminiButton: {
    position: 'absolute',
    bottom: 40,
    left: '50%',
    transform: [{ translateX: -25 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
})

export default ImageScanner