import { View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import EvilIcons from '@expo/vector-icons/EvilIcons';

const AnalyzePage = () => {
  const { result } = useLocalSearchParams();
  const router = useRouter();
  const parsedResult = result ? JSON.parse(Array.isArray(result) ? result[0] : result) : null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closebutton} onPress={() => router.push('/imageScanner')}>
        <EvilIcons name="close" size={30} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Image Analysis</Text>
      {parsedResult?.message === "Cannot Identify" ? (
  <Text style={styles.resultText}>Cannot Identify the plant. Try again.</Text>
) : (
  <>
    <Text style={styles.resultText}>Scientific Name: {parsedResult.scientific_name || "Unknown"}</Text>
    <Text style={styles.resultText}>Common Names: {parsedResult.common_names?.join(', ') || "Not available"}</Text>
    <Text style={styles.resultText}>Edible Parts: {parsedResult.edible_parts?.join(', ') || "Not available"}</Text>
    <Text style={styles.resultText}>Confidence: {parsedResult.confidence || "N/A"}</Text>
  </>
)}


      {/* Button to go back to Image Scanner */}
      <TouchableOpacity style={styles.scanAgainButton} onPress={() => router.push('/imageScanner')}>
        <Text style={styles.scanAgainButtonText}>Scan Another Image</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  scanAgainButton: {
    marginTop: 30,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  scanAgainButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closebutton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: 10,
    borderRadius: 30,
  },
});

export default AnalyzePage;
