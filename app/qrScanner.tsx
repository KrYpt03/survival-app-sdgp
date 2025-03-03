import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'


const qrScanner = () => {
  return (
    <View>
      <View>
        <Image source={require('../assets/images/QRPageBackground.png')} style={styles.main} />
      </View>
      <View style={styles.overlay}>
          <Text style={styles.text}>Scan Me</Text>
          
      </View>      
    </View>
    
  );
};



export default qrScanner