import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';

const CreateTeam = () => {
  const [groupName, setGroupName] = useState('');

  return (
    <ImageBackground
      source={require('../assets/images/882a1e39-7619-4d2d-8934-01ec2145083f.png')}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar style="inverted" />
        <Text style={styles.heading}>Create Team</Text>
        <View style={styles.innerContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Enter group name</Text>
            <TextInput
              style={styles.textBox}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="Group Name"
              placeholderTextColor="#aaa"
            />
            <Link
              href={{
                pathname: '/createTeamQRCode',
                params: { groupName },
              }}
              asChild
            >
              <TouchableOpacity style={styles.doneButton}>
                <Text style={styles.doneButtonText}>Next</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  container: {
    flexGrow: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#172621',
    marginBottom: 20,
  },
  innerContainer: {
    width: 320,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  textContainer: {
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '400',
    color: '#1d1b20',
    marginBottom: 10,
  },
  textBox: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  doneButton: {
    backgroundColor: '#007aff',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CreateTeam;
