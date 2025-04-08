import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, SafeAreaView, Dimensions, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/images/882a1e39-7619-4d2d-8934-01ec2145083f.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ScrollView style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)']}
          style={styles.gradient}
        >
          {/* Hero Section */}
          <View style={styles.hero}>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Welcome to</Text>
              <Text style={styles.appName}>Trail Guard</Text>
              <Text style={styles.heroSubtitle}>Your guide for exploring and traveling</Text>
            </View>
          </View>

          {/* Features Section */}
          <View style={styles.features}>
            <Text style={styles.sectionTitle}>Key Features</Text>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Text style={styles.iconText}>👥</Text>
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Group Tracking System</Text>
                <Text style={styles.featureDescription}>The app includes an alarm system that tracks the proximity of each group member.</Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Text style={styles.iconText}>🌿</Text>
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>AI Plant Identification</Text>
                <Text style={styles.featureDescription}>AI powered camera that enables users to identify plants.</Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Text style={styles.iconText}>⛅</Text>
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Weather Alerts</Text>
                <Text style={styles.featureDescription}>Real-time weather updates and warnings.</Text>
              </View>
            </View>
          </View>

          {/* Call to Action Section */}
          <View style={styles.cta}>
            <Text style={styles.ctaTitle}>Ready to Experience It?</Text>
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={() => router.push('/Loging')}
            >
              <LinearGradient
                colors={['#7928CA', '#4C1D95']}
                style={styles.buttonGradient}
              >
                <Text style={styles.ctaButtonText}>Continue →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>© {new Date().getFullYear()} TrailGuard. All rights reserved.</Text>
          </View>
        </LinearGradient>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  hero: {
    height: 300,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    padding: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#7928CA',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  features: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 24,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  cta: {
    padding: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  ctaButton: {
    width: width * 0.8,
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.6,
  },
});

export default WelcomeScreen;
