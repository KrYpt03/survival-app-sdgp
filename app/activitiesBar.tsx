import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // use MaterialIcons for Hiking ,Travel, Photography
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign'; // calendor icon

const ActivitiesBar = () => {
  return (
    
    <View style={styles.container}>
      <ScrollView>
      {/* Location and Date/Members */}
      <View style={styles.header}>
        <View style={styles.location}>
          <View style={styles.dot} />
          <View>
            <Text style={styles.locationText}> Suomenlinna, </Text>
            <Text style={styles.locationText}> Finland</Text>
          </View>
        </View>
      </View>
      <View style={styles.info}>
        <TouchableOpacity style={styles.infoButton}>
        <AntDesign name="calendar" size={18} color="black" />
          <Text style={styles.infoText}>5 Dec - 9 Dec</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoButton}>
          <MaterialIcons name="people" size={18} color="black" />
          <Text style={styles.infoText}>Members - 10</Text>
        </TouchableOpacity>
      </View>
        

      {/* Activity Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity</Text>
        <View style={styles.activityIcons}>
          {/* Replace with your icon components/images */}
          <View style={styles.activityIcon}>
            <MaterialIcons style={styles.activityIconStyle} name="hiking" size={30} color="black" />
            <Text style={styles.activityLabel}>Hike</Text>
          </View>
          <View style={styles.activityIcon}>
            {/* <MaterialIcons name="tent" size={30} color="black" /> */}
            <MaterialCommunityIcons style={styles.activityIconStyle} name="tent" size={30} color="black" />
            <Text style={styles.activityLabel}>Camping</Text>
          </View>
          <View style={styles.activityIcon}>
            <MaterialIcons style={styles.activityIconStyle} name="directions-bus" size={30} color="black" />
            <Text style={styles.activityLabel}>Travel</Text>
          </View>
          <View style={styles.activityIcon}>
            <MaterialIcons style={styles.activityIconStyle} name="camera-alt" size={30} color="black" />
            <Text style={styles.activityLabel}>Photo</Text>
          </View>
        </View>
      </View>

      {/* Services Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.servicesGrid}>
          {/* Replace with your image components/images */}
          <View style={styles.serviceItem}>
            <Text style={styles.serviceLabel}>Equipments</Text>
          </View>
          <View style={styles.serviceItem}>
            <Text style={styles.serviceLabel}>Tracks</Text>
          </View>
          <View style={styles.serviceItem}>
            <Text style={styles.serviceLabel}>Guide</Text>
          </View>
          <View style={styles.serviceItem}>
            <View style={styles.weatherContainer}>
              <Text style={styles.weatherTemp}>25°</Text>
              <Text style={styles.weatherLabel}>Weather</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
    </View>
    
  );
};

const styles = StyleSheet.create({
  buttonSection: {
    marginTop: 10,
    marginBottom: 0,
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 0
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: 'lightgray',
    marginRight: 8,
  },
  locationText: {
    fontSize: 30,
    fontWeight: 'bold',
    // fontFamily: 'TimesNewRoman',
    color:'#4682B4',
  },
  info: {
    flexDirection: 'row',
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 15,
    padding: 5,
  },
  infoText: {
    marginLeft: 4,
  },
  section: {
    marginBottom: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  activityIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  activityIcon: {
    alignItems: 'center',
    padding: 10,
    
  },
  activityIconStyle: {
    // width: 50,
    // height: 50,
    borderRadius: 20,
    padding: 15,
    backgroundColor: 'lightgray',
  },
  activityLabel: {
    marginTop: 4,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: '48%', // Adjust as needed
    marginBottom: 10,
    alignItems: 'center',
  },
  serviceLabel: {
    marginTop: 4,
  },
  weatherContainer: {
    backgroundColor: '#13274F', // Or your desired color
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  weatherTemp: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  weatherLabel: {
    marginTop: 4,
    color:'white',
  },

});

export default ActivitiesBar;
