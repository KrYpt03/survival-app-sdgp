import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

const ImageScanner = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="inverted" />
      <Image source={require('../assets/images/imageScn.png')} style={styles.image} />
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
  },
})

export default ImageScanner