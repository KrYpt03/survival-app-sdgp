import { StyleSheet, Text, TouchableOpacity, View, Switch, Linking, ScrollView } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import NavigationBar from './components/NavigationBar';

const settings = () => {
  // Set default state to true for both notifications and dark mode
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)

  const openSupport = () => {
    Linking.openURL('mailto:support@yourapp.com');
  };

  return (
    <View style={[styles.container, darkModeEnabled && styles.darkContainer]}>
      <StatusBar style={darkModeEnabled ? "light" : "inverted"} />

      <View>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back-outline" size={24} color={darkModeEnabled ? "white" : "black"} />
          </TouchableOpacity>
        </Link>
      </View>

      {/* Settings Title */}
      <View style={styles.header}>
        <Text style={[styles.title, darkModeEnabled && styles.darkText]}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsContainer}>
          <View style={styles.settingRow}>
            <Ionicons name="notifications-outline" size={24} color={darkModeEnabled ? "white" : "black"} />
            <Text numberOfLines={1} style={[styles.settingText, darkModeEnabled && styles.darkText]}>Notifications</Text>
            <Switch 
              value={notificationsEnabled}
              onValueChange={() => setNotificationsEnabled(previousState => !previousState)}
            />
          </View>
          <View style={styles.settingRow}>
            <Ionicons name="key-outline" size={24} color={darkModeEnabled ? "white" : "black"} />
            <Text style={[styles.settingText, darkModeEnabled && styles.darkText]}>Change password</Text>
          </View>
          <View style={styles.settingRow}>
            <Ionicons name="moon-outline" size={24} color={darkModeEnabled ? "white" : "black"} />
            <Text numberOfLines={1} style={[styles.settingText, darkModeEnabled && styles.darkText]}>Dark mode</Text>
            <Switch 
              value={darkModeEnabled} 
              onValueChange={() => setDarkModeEnabled(previousState => !previousState)}
            />
          </View>

          {/* Help & Support Section */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, darkModeEnabled && styles.darkText]}>Help & Support</Text>
          </View>
          <TouchableOpacity onPress={openSupport}>
            <View style={styles.settingRow}>
              <Ionicons name="help-circle-outline" size={24} color={darkModeEnabled ? "white" : "black"} />
              <Text style={[styles.settingText, darkModeEnabled && styles.darkText]}>Contact Support</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.settingRow}>
              <Ionicons name="document-text-outline" size={24} color={darkModeEnabled ? "white" : "black"} />
              <Text style={[styles.settingText, darkModeEnabled && styles.darkText]}>FAQ</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.settingRow}>
              <Ionicons name="shield-checkmark-outline" size={24} color={darkModeEnabled ? "white" : "black"} />
              <Text style={[styles.settingText, darkModeEnabled && styles.darkText]}>Privacy Policy</Text>
            </View>
          </TouchableOpacity>

          {/* About Section */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, darkModeEnabled && styles.darkText]}>About</Text>
          </View>
          <View style={styles.settingRow}>
            <Ionicons name="information-circle-outline" size={24} color={darkModeEnabled ? "white" : "black"} />
            <Text style={[styles.settingText, darkModeEnabled && styles.darkText]}>Version 1.0.0</Text>
          </View>
          <TouchableOpacity>
            <View style={styles.settingRow}>
              <Ionicons name="refresh-outline" size={24} color={darkModeEnabled ? "white" : "black"} />
              <Text style={[styles.settingText, darkModeEnabled && styles.darkText]}>Check for Updates</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.settingRow}>
              <Ionicons name="newspaper-outline" size={24} color={darkModeEnabled ? "white" : "black"} />
              <Text style={[styles.settingText, darkModeEnabled && styles.darkText]}>Changelog</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.logout}>
              <Ionicons name="exit-outline" size={24} color={darkModeEnabled ? "white" : "black"} />
              <Text style={[styles.settingText, darkModeEnabled && styles.darkText]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <NavigationBar />
    </View>
  )
}

export default settings

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  darkContainer: {
    backgroundColor: '#121212'
  },
  header: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 10,
    color: 'black'
  },
  darkText: {
    color: 'white'
  },
  settingsContainer: {
    marginTop: 20,
    borderRadius: 20,
    justifyContent: 'space-between',
    paddingBottom: 80, // Increased padding to account for NavigationBar height
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
  },
  settingText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    color: 'black'
  },
  buttonSection: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: "#F6F0F8",
    borderRadius: 30,
    height: 70,
    width: '90%',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  darkButtonContainer: {
    backgroundColor: "#1c1c1e",
    borderWidth: 1,
    borderColor: "white",
  },
  button: {
    padding: 10,
  },
  backButton: {
    padding: 5,
    left: 0,
    top: 0, 
    marginLeft: 5, 
    marginTop: 20,
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
    paddingLeft: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'uppercase',
  },
})
