import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import EvilIcons from '@expo/vector-icons/EvilIcons';

interface PlantDetail {
  value?: string;
  citation?: string;
  license_name?: string;
  license_url?: string;
}

const renderPlantDetail = (detail: PlantDetail | string): string => {
  if (typeof detail === 'string') return detail;
  return detail.value || 'Not available';
};

const AnalyzePage = () => {
  const { result } = useLocalSearchParams();
  const router = useRouter();
  
  // Parse the result safely
  const parsedResult = React.useMemo(() => {
    try {
      return result ? JSON.parse(Array.isArray(result) ? result[0] : result) : null;
    } catch (error) {
      console.error('Error parsing result:', error);
      return null;
    }
  }, [result]);

  if (!parsedResult) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No analysis data available</Text>
        <TouchableOpacity style={styles.scanAgainButton} onPress={() => router.push('/imageScanner')}>
          <Text style={styles.scanAgainButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Helper function to format array of details
  const formatDetails = (details: (PlantDetail | string)[] | undefined): string => {
    if (!details || details.length === 0) return "Not available";
    return details.map(detail => renderPlantDetail(detail)).join(', ');
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={() => router.push('/imageScanner')}>
          <EvilIcons name="close" size={32} color="#1B4332" />
        </TouchableOpacity>

        <Text style={styles.title}>Plant Analysis Results</Text>

        <View style={styles.resultContainer}>
          {parsedResult?.message === "Cannot Identify" ? (
            <>
              <Text style={styles.errorText}>❌ Unable to identify the plant.</Text>
              <Text style={styles.suggestionText}>
                Please ensure the image is clear and try again with a different angle or lighting.
              </Text>
            </>
          ) : (
            <>
              <View style={styles.resultSection}>
                <Text style={styles.sectionTitle}>Scientific Classification</Text>
                <Text style={styles.resultText}>
                  <Text style={styles.label}>Name: </Text>
                  {renderPlantDetail(parsedResult.scientific_name) || "Unknown"}
                </Text>
                <Text style={styles.confidenceText}>
                  Confidence: {parsedResult.confidence || "N/A"}
                </Text>
              </View>

              <View style={styles.resultSection}>
                <Text style={styles.sectionTitle}>Common Names</Text>
                <Text style={styles.resultText}>
                  {formatDetails(parsedResult.common_names)}
                </Text>
              </View>

              {parsedResult.edible_parts && parsedResult.edible_parts.length > 0 && (
                <View style={styles.resultSection}>
                  <Text style={styles.sectionTitle}>Edible Parts</Text>
                  <Text style={styles.resultText}>
                    {formatDetails(parsedResult.edible_parts)}
                  </Text>
                </View>
              )}

              {parsedResult.description && (
                <View style={styles.resultSection}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.descriptionText}>
                    {renderPlantDetail(parsedResult.description)}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Scan Again Button */}
        <TouchableOpacity 
          style={styles.scanAgainButton} 
          onPress={() => router.push('/imageScanner')}
        >
          <Text style={styles.scanAgainButtonText}>Scan Another Plant</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#D8F3DC',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#D8F3DC',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 20,
    marginTop: 20,
  },
  resultContainer: {
    backgroundColor: '#B7E4C7',
    padding: 20,
    borderRadius: 15,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  resultSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B4332',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    color: '#1B4332',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#1B4332',
    lineHeight: 24,
  },
  confidenceText: {
    fontSize: 14,
    color: '#40916C',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 18,
    color: '#D62828',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  suggestionText: {
    fontSize: 16,
    color: '#1B4332',
    textAlign: 'center',
    marginTop: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#40916C',
  },
  scanAgainButton: {
    marginTop: 30,
    backgroundColor: '#1B4332',
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  scanAgainButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#95D5B2',
    padding: 10,
    borderRadius: 30,
    zIndex: 1,
  },
});

export default AnalyzePage; 