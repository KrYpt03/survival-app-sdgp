"use client"

import React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, StatusBar } from "react-native"
import MapView, { Circle } from "react-native-maps"
import { useRouter } from "expo-router"
import { ArrowLeft, Bell } from "lucide-react-native"

// Fix for Marker typing issue
import { Marker as RawMarker } from "react-native-maps"
const Marker = RawMarker as unknown as React.FC<any>

import AlertPopup from "../components/AlertPopup"
import NavigationBar from "../components/NavigationBar"
import UserProfileModal from "../components/UserProfileModal"

interface GroupMember {
  id: number
  name: string
  latitude: number
  longitude: number
  isOutsideZone?: boolean
}

const UserGroupTrackingScreen: React.FC = () => {
  const router = useRouter()
  const [showWarning, setShowWarning] = useState<boolean>(false)
  const [showLeaderNotification, setShowLeaderNotification] = useState<boolean>(false)
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null)
  const [showUserProfile, setShowUserProfile] = useState<boolean>(false)

  // Demo toggle for different states
  const [demoState, setDemoState] = useState<string>("normal") // normal, warning, leader

  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([
    { id: 1, name: "Thisula (Leader)", latitude: 6.799, longitude: 80.798 },
    { id: 2, name: "Kevin", latitude: 6.798, longitude: 80.808 },
    { id: 3, name: "You", latitude: 6.797, longitude: 80.815 },
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
        setShowLeaderNotification(false)
        break
      case "leader":
        setShowWarning(false)
        setShowLeaderNotification(true)
        break
      default:
        setShowWarning(false)
        setShowLeaderNotification(false)
    }
  }, [demoState])

  const handleLeaveGroup = () => {
    console.log("Left Group")
    router.back()
  }

  const handleMemberPress = (member: GroupMember) => {
    // Don't allow viewing your own profile
    if (member.name === "You") return

    setSelectedMember(member)
    setShowUserProfile(true)
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
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

        {groupMembers.map((member) => (
          <Marker
            key={member.id}
            coordinate={{ latitude: member.latitude, longitude: member.longitude }}
            title={member.name}
            onPress={() => handleMemberPress(member)}
          >
            <View style={styles.markerContainer}>
              <View
                style={[
                  styles.marker,
                  member.name === "You" ? styles.yourMarker : null,
                  member.name.includes("Leader") ? styles.leaderMarker : null,
                ]}
              />
              <Text style={styles.markerText}>{member.name}</Text>
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

      {showLeaderNotification && (
        <View style={styles.leaderNotification}>
          <Bell size={20} color="#333" />
          <Text style={styles.leaderNotificationText}>Thisula is the team leader</Text>
        </View>
      )}

      <View style={styles.actionButtonContainer}>
        <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveGroup}>
          <Text style={styles.buttonText}>Leave</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showUserProfile}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUserProfile(false)}
      >
        <UserProfileModal
          username={selectedMember?.name || "Thisula"}
          onClose={() => setShowUserProfile(false)}
          showLeaderOption={false}
          isRegularUserView={true}
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
          style={[styles.demoButton, demoState === "leader" && styles.activeDemoButton]}
          onPress={() => setDemoState("leader")}
        >
          <Text style={styles.demoButtonText}>Leader Info</Text>
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
  yourMarker: {
    backgroundColor: "#4287f5", // Blue color for your own marker
  },
  leaderMarker: {
    backgroundColor: "#f5a742", // Orange color for leader
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

export default UserGroupTrackingScreen

