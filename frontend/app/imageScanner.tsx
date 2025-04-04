import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';

const API_URL = 'https://trail-guard.onrender.com/api/plant/identify'; // Update this with your server IP

const ImageScanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7, // Reduce quality for faster upload
          base64: false,
        });
        if (photo) {
          setCapturedImage(photo.uri);
          setShowModal(true);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to capture image. Please try again.');
      }
    }
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;

    setLoading(true);
    try {
      // Create form data
      const formData = new FormData();
      
      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(capturedImage);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }

      // Create file object
      formData.append('image', {
        uri: capturedImage,
        type: 'image/jpeg',
        name: 'plant-image.jpg',
      } as any);

      // Make API request
      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });

      if (response.data) {
        setResult(response.data);
        setShowModal(false);
        router.push({ 
          pathname: '/analyzePage', 
          params: { 
            result: JSON.stringify(response.data)
          }
        });
      }
    } catch (error: any) {
      let errorMessage = 'Failed to analyze image. Please try again.';
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data.error || errorMessage;
      } else if (error.request) {
        // No response received
        errorMessage = 'Could not connect to server. Please check your connection.';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text>We need your permission to use the camera</Text>
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="inverted" />
      <CameraView style={styles.camera} ref={cameraRef}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.focusSquare} />
        <TouchableOpacity style={styles.scanButton} onPress={takePicture}>
          <Ionicons name="scan" size={35} color="white" />
        </TouchableOpacity>
      </CameraView>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {capturedImage && (
              <Image 
                source={{ uri: capturedImage }} 
                style={styles.capturedImage} 
              />
            )}
            <TouchableOpacity 
              style={[
                styles.analyzeButton,
                loading && styles.disabledButton
              ]} 
              onPress={analyzeImage}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.analyzeButtonText}>Analyze</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <EvilIcons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  focusSquare: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 10,
    alignSelf: 'center',
    top: '35%',
  },
  scanButton: {
    position: 'absolute',
    bottom: 40,
    left: '50%',
    transform: [{ translateX: -25 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#E5E4E2',
    padding: 20,
    paddingBottom: 60,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: 'center',
  },
  capturedImage: {
    width: 250,
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    borderRadius: 100,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  analyzeButton: {
    position: 'absolute',
    justifyContent: 'center',
    left: '58%',
    alignItems: 'center',
    bottom: 20,
    paddingTop: 10,
    transform: [{ translateX: -50 }],
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 20,
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
  },
});

export default ImageScanner;