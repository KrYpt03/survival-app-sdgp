import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'


const qrScanner = () => {
  return (
    <View>
      <StatusBar style="inverted" />
      <View>
        <Image source={require('../assets/images/QRPageBackground.png')} style={styles.main} />
      </View>
      <View style={styles.overlay}>
          <Text style={styles.text}>Scan Me</Text>
      </View> 
      <View>
        <Image source={require('../assets/images/QRCode.png')} style={styles.overlay} />
      </View>     
    </View>
    
  );
};


const styles = StyleSheet.create({
  main:{
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    top: 0,
    left: 0,
  },
  overlay: {
    position: 'absolute',
    top: '40%', // Adjust as needed
    left: '45%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white', // Adjust color as needed
  },
  
});

export default qrScanner