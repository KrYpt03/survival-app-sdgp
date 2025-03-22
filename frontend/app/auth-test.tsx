import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth, useSession } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

export default function AuthTest() {
  const { isLoaded, isSignedIn } = useAuth();
  const { session } = useSession();
  const [publicData, setPublicData] = useState<any>(null);
  const [protectedData, setProtectedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Store the session token when it changes
  useEffect(() => {
    const storeSessionToken = async () => {
      if (session) {
        const token = await session.getToken();
        await SecureStore.setItemAsync('clerk-session-token', token);
      }
    };
    storeSessionToken();
  }, [session]);

  const testPublicEndpoint = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/test/public');
      setPublicData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'An error occurred');
      console.error('Public endpoint error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testProtectedEndpoint = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Ensure we have a fresh token
      if (session) {
        const token = await session.getToken();
        await SecureStore.setItemAsync('clerk-session-token', token);
      }

      const response = await api.get('/test/protected');
      setProtectedData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'An error occurred');
      console.error('Protected endpoint error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Auth Test Screen</Text>
        
        <View style={styles.statusCard}>
          <Text style={styles.label}>Auth Status:</Text>
          <Text style={styles.value}>
            {isSignedIn ? '✅ Signed In' : '❌ Not Signed In'}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.label}>API URL:</Text>
          <Text style={styles.value}>https://trail-guard.onrender.com/api</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={testPublicEndpoint}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Testing...' : 'Test Public Endpoint'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, !isSignedIn && styles.buttonDisabled]} 
            onPress={testProtectedEndpoint}
            disabled={!isSignedIn || loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Testing...' : 'Test Protected Endpoint'}
            </Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {publicData && (
          <View style={styles.resultCard}>
            <Text style={styles.cardTitle}>Public Response:</Text>
            <Text style={styles.cardContent}>
              {JSON.stringify(publicData, null, 2)}
            </Text>
          </View>
        )}

        {protectedData && (
          <View style={styles.resultCard}>
            <Text style={styles.cardTitle}>Protected Response:</Text>
            <Text style={styles.cardContent}>
              {JSON.stringify(protectedData, null, 2)}
            </Text>
          </View>
        )}
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
  statusCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  value: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorCard: {
    backgroundColor: '#FFE5E5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#D00000',
    fontSize: 14,
  },
  resultCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 14,
    color: '#666',
  },
}); 