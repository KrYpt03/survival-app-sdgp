"use client"

import { useEffect } from "react"
import { View, Text, ImageBackground, SafeAreaView, StyleSheet, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"

const { width, height } = Dimensions.get("window")

export default function LoadingScreen() {
  const navigation = useNavigation()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Loging" as never)
    }, 6000)

    return () => clearTimeout(timer)
  }, [navigation])

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require("../../assets/882a1e39-7619-4d2d-8934-01ec2145083f.png")}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <ImageBackground
              style={styles.smallLogo}
              source={require("../../assets/3d462754-0e3e-47dd-b69b-705f9825ed43.png")}
              resizeMode="contain"
            />
            <Text style={styles.appName}>Trail Guard</Text>
            <View style={styles.menuIcon}>
              <ImageBackground
                style={styles.menuLine}
                source={require("../../assets/598abff4-864b-4377-8e2a-cd4e76efea0d.png")}
                resizeMode="cover"
              />
              <ImageBackground
                style={[styles.menuLine, styles.menuLineMiddle]}
                source={require("../../assets/66720931-0cfe-47fc-8b62-191ae762edc6.png")}
                resizeMode="cover"
              />
              <ImageBackground
                style={[styles.menuLine, styles.menuLineBottom]}
                source={require("../../assets/c64db674-2ded-4d72-a275-ced80266cff2.png")}
                resizeMode="cover"
              />
            </View>
          </View>
          <View style={styles.logoContainer}>
            <ImageBackground style={styles.largeLogo} source={require("../../assets/Logo2.png")} resizeMode="contain" />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 23,
  },
  smallLogo: {
    width: 29,
    height: 30,
  },
  appName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000000",
    marginLeft: -210, // Adjust this value to position the text correctly
  },
  menuIcon: {
    width: 27,
    height: 14,
    justifyContent: "space-between",
  },
  menuLine: {
    width: 27,
    height: 2,
  },
  menuLineMiddle: {
    width: 23,
  },
  menuLineBottom: {
    width: 18,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  largeLogo: {
    width: 500,
    height: 500,
    marginBottom: 150,
  },
})

