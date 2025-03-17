import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';

const WelcomeScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <StatusBar style="inverted" />
      
      {/* Hero Section */}
      <View style={styles.hero}>
        <Image source={require('../assets/images/adventure.jpg')} style={styles.heroImage} />
        <Text style={styles.heroTitle}>Welcome to</Text>
        <Text style={styles.appName}>Trail Guard</Text>
        <Text style={styles.heroSubtitle}>Your guide for exploring and traveling.</Text>
      </View>

      {/* Features Section */}
      <View style={styles.features}>
        <Text style={styles.sectionTitle}>Key Features</Text>

        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Group Tracking System</Text>
          <Text style={styles.featureDescription}>The app includes an alarm system that tracks the proximity of each group member.</Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>AI Plant Identification</Text>
          <Text style={styles.featureDescription}>AI powered camera that enables users to identify plants.</Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Weather Alerts</Text>
          <Text style={styles.featureDescription}>Real-time weather updates and warnings.</Text>
        </View>
      </View>

      {/* Call to Action Section */}
      <View style={styles.cta}>
        <Text style={styles.ctaTitle}>Ready to Experience It?</Text>
        <Link href="/activitiesBar" asChild>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Continue → </Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© {new Date().getFullYear()} TrailGuard. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 40,
  },
  heroImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
    color: "#7928CA",
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  features: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  featureItem: {
    marginBottom: 30,
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  cta: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 60,
    marginHorizontal: 10,
    alignItems: 'center',
    borderRadius: 40,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  footerText: {
    fontSize: 14,
    color: '#888',
  },
});

export default WelcomeScreen;