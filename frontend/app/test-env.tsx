import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default function TestEnv() {
  const extra = Constants.expoConfig?.extra || {};
  
  const renderEnvValue = (label: string, value: any) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>
        {typeof value === 'boolean' 
          ? (value ? '✅ Enabled' : '❌ Disabled')
          : value 
          ? (typeof value === 'string' && value.startsWith('pk_') 
            ? '✅ Set (Hidden)' 
            : value)
          : '❌ Not Set'}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Environment Test</Text>
        
        {renderEnvValue('API Base URL', extra.apiBaseUrl)}
        {renderEnvValue('QR API URL', extra.qrApiBaseUrl)}
        {renderEnvValue('Trip API URL', extra.tripApiBaseUrl)}
        {renderEnvValue('Clerk Key', extra.clerkPublishableKey)}
        {renderEnvValue('Google Maps Key', extra.googleMapsApiKey)}
        {renderEnvValue('App Environment', extra.appEnv)}
        {renderEnvValue('Debug Mode', extra.debug)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  value: {
    fontSize: 16,
    flex: 2,
    color: '#666',
  },
}); 