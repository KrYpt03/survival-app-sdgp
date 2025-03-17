import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ActivityIndicator } from 'react-native';
import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import axios from 'axios';
import { useRouter } from 'expo-router';

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
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        setCapturedImage(photo.uri);
        setShowModal(true);
      }
    }
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', { uri: capturedImage, type: 'image/jpeg', name: 'photo.jpg' } as any);

      const response = await axios.post('http://192.168.1.34:5000/identify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResult(response.data);
      setShowModal(false);
      router.push({ pathname: '/analyzePage', params: { result: JSON.stringify(response.data) } });
    } catch (error) {
      console.error('Error identifying plant:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="inverted" />
      <CameraView style={styles.camera} ref={cameraRef}>
        <TouchableOpacity style={styles.scanButton} onPress={takePicture}>
          <Ionicons name="scan" size={35} color="white" />
        </TouchableOpacity>
      </CameraView>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {capturedImage && <Image source={{ uri: capturedImage }} style={styles.capturedImage} />}
            <TouchableOpacity style={styles.analyzeButton} onPress={analyzeImage}>
              <Text style={styles.analyzeButtonText}>Analyze</Text>
            </TouchableOpacity>
            {loading && <ActivityIndicator size="large" color="#007bff" />}
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
    top: 0,
    right: 0,
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
  resultContainer: {
    marginTop: 20,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
});

export default ImageScanner;
