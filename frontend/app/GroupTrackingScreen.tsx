"use client"

import React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, StatusBar } from "react-native"
import MapView, { Circle } from "react-native-maps"
import { useNavigation } from "@react-navigation/native"
import { ArrowLeft, Bell } from "lucide-react-native"

// Fix for Marker typing issue
import { Marker as RawMarker } from "react-native-maps"
const Marker = RawMarker as unknown as React.FC<any>

import AlertPopup from "../components/AlertPopup"
import NavigationBar from "../components/NavigationBar"
import UserProfileModal from "../components/UserProfileModal"
import { locationApi, UserLocation } from "../api/location"
import { useUser } from "@clerk/clerk-expo"
import { teamApi } from "../api/team"
import { userApi } from "../api/user"

interface GroupMember {
  id: number
  name: string
  latitude: number
  longitude: number
  isOutsideZone?: boolean
}

const GroupTrackingScreen: React.FC = () => {
  const { user } = useUser();

  const navigation = useNavigation()
  const [showWarning, setShowWarning] = useState<boolean>(false)
  const [showKickedAlert, setShowKickedAlert] = useState<boolean>(false)
  const [showLeaderNotification, setShowLeaderNotification] = useState<boolean>(false)
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null)
  const [showUserProfile, setShowUserProfile] = useState<boolean>(false)
  const [isLeader, setIsLeader] = useState<boolean>(true)

  // Demo toggle for different states
  const [demoState, setDemoState] = useState<string>("normal") // normal, warning, kicked, leader

  const [teamLocation, setTeamLocation] = useState<UserLocation[]>([]);

  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([
    { id: 1, name: "Thisula", latitude: 6.799, longitude: 80.798 },
    { id: 2, name: "Kevin", latitude: 6.798, longitude: 80.808 },
    { id: 3, name: "Akindu", latitude: 6.797, longitude: 80.815 },
  ])

  const [outsideMember, setOutsideMember] = useState<GroupMember>({
    id: 4,
    name: "Member 1",
    latitude: 6.81,
    longitude: 80.78,
    isOutsideZone: true,
  })

  useEffect(() => {
    // For demo purposes, show different states based on demoState
    switch (demoState) {
      case "warning":
        setShowWarning(true)
        setShowKickedAlert(false)
        setShowLeaderNotification(false)
        break
      case "kicked":
        setShowWarning(false)
        setShowKickedAlert(true)
        setShowLeaderNotification(false)
        break
      case "leader":
        setShowWarning(false)
        setShowKickedAlert(false)
        setShowLeaderNotification(true)
        break
      default:
        setShowWarning(false)
        setShowKickedAlert(false)
        setShowLeaderNotification(false)
    }
  }, [demoState])

  const handleEndTracking = () => {
    console.log("Tracking Ended")
    navigation.goBack()
  }

  const handleLeaveGroup = () => {
    console.log("Left Group")
    navigation.goBack()
  }

  const handleMemberPress = (member: GroupMember) => {
    setSelectedMember(member)
    setShowUserProfile(true)
  }

  const handleKickMember = () => {
    if (selectedMember) {
      setGroupMembers(groupMembers.filter((member) => member.id !== selectedMember.id))
      setShowUserProfile(false)
      setDemoState("kicked")
    }
  }

  const handleAppointLeader = () => {
    setIsLeader(false)
    setShowUserProfile(false)
  }

  // Get team location data
  const getTeamLocationData = async () => {
    try {
      if (!user) {
        return;
      }
      // Get user
      const userData = await userApi.getUser(user.id);

      if(!userData || !userData?.user){
        return;
      }

      // Api end-point to get user team
      const team = await teamApi.getUserTeam(userData.user.userID);

      if (!team?.teamID) {
        return;
      }

      // Api end-point to get team location
      const data = await locationApi.getTeamLocation(team.teamID);

      setTeamLocation(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getTeamLeaderLocation = async () => {
    
  }

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     getTeamLocationData();
  //   }, 5000);
  
  //   return () => clearInterval(interval); // Cleanup on unmount
  // }, []);
  
  

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 6.8,
          longitude: 80.8,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Circle
          center={{ latitude: 6.8, longitude: 80.8 }}
          radius={500}
          strokeColor="red"
          fillColor="rgba(255,0,0,0.1)"
        />

        {teamLocation?.map((location, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title={location.userID}
          // onPress={() => handleMemberPress(member)}
          >
            <View style={styles.markerContainer}>
              <View style={styles.marker} />
              <Text style={styles.markerText}>{location.userID}</Text>
            </View>
          </Marker>
        ))}

        {showWarning && (
          <Marker
            coordinate={{ latitude: outsideMember.latitude, longitude: outsideMember.longitude }}
            title={outsideMember.name}
          >
            <View style={styles.markerContainer}>
              <View style={styles.marker} />
              <Text style={styles.markerText}>{outsideMember.name}</Text>
            </View>
          </Marker>
        )}
      </MapView>

      {showWarning && (
        <AlertPopup
          title="Warning !"
          message="Member 1 has moved outside the designated operational zone. Please be aware of this status and take any necessary actions."
          onClose={() => setDemoState("normal")}
        />
      )}

      {showKickedAlert && (
        <AlertPopup
          title=""
          message={`${selectedMember?.name || "Akindu"} has been kicked from the server`}
          onClose={() => setDemoState("normal")}
        />
      )}

      {showLeaderNotification && (
        <View style={styles.leaderNotification}>
          <Bell size={20} color="#333" />
          <Text style={styles.leaderNotificationText}>You are the team leader!</Text>
        </View>
      )}

      <View style={styles.actionButtonContainer}>
        {isLeader ? (
          <TouchableOpacity style={styles.endButton} onPress={handleEndTracking}>
            <Text style={styles.buttonText}>End</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveGroup}>
            <Text style={styles.buttonText}>Leave</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={showUserProfile}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUserProfile(false)}
      >
        <UserProfileModal
          username={selectedMember?.name || "Akindu"}
          onClose={() => setShowUserProfile(false)}
          onKick={handleKickMember}
          onAppointLeader={handleAppointLeader}
          showLeaderOption={isLeader}
        />
      </Modal>

      {/* Demo controls - remove in production */}
      <View style={styles.demoControls}>
        <TouchableOpacity
          style={[styles.demoButton, demoState === "normal" && styles.activeDemoButton]}
          onPress={() => setDemoState("normal")}
        >
          <Text style={styles.demoButtonText}>Normal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.demoButton, demoState === "warning" && styles.activeDemoButton]}
          onPress={() => setDemoState("warning")}
        >
          <Text style={styles.demoButtonText}>Warning</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.demoButton, demoState === "kicked" && styles.activeDemoButton]}
          onPress={() => setDemoState("kicked")}
        >
          <Text style={styles.demoButtonText}>Kicked</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.demoButton, demoState === "leader" && styles.activeDemoButton]}
          onPress={() => setDemoState("leader")}
        >
          <Text style={styles.demoButtonText}>Leader</Text>
        </TouchableOpacity>
      </View>

      <NavigationBar />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d4f5e2",
  },
  header: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: "center",
  },
  marker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ff4d4f",
  },
  markerText: {
    fontSize: 12,
    fontWeight: "bold",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  actionButtonContainer: {
    position: "absolute",
    bottom: 90,
    right: 20,
    zIndex: 5,
  },
  endButton: {
    backgroundColor: "#ff4d4f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  leaveButton: {
    backgroundColor: "#ff4d4f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  leaderNotification: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "#e0e0e0",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginHorizontal: 20,
  },
  leaderNotificationText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  demoControls: {
    position: "absolute",
    top: 100,
    left: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    zIndex: 10,
  },
  demoButton: {
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  activeDemoButton: {
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  demoButtonText: {
    fontSize: 10,
  },
})

export default GroupTrackingScreen