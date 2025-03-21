import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native"
import { X } from "lucide-react-native"

interface UserProfileModalProps {
  username: string
  onClose: () => void
  onKick: () => void
  onAppointLeader: () => void
  showLeaderOption: boolean
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  username,
  onClose,
  onKick,
  onAppointLeader,
  showLeaderOption,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.username}>{username}</Text>
        </View>

        <View style={styles.profileImageContainer}>
          <Image source={require("../public/images/member-avatar.png")} style={styles.profileImage} />
        </View>

        <View style={styles.actions}>
          {showLeaderOption && (
            <TouchableOpacity style={styles.appointButton} onPress={onAppointLeader}>
              <Text style={styles.appointButtonText}>Appoint as Leader</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.kickButton} onPress={onKick}>
            <Text style={styles.kickButtonText}>Kick</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: 250,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    left: 0,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ffdddd",
  },
  actions: {
    gap: 10,
  },
  appointButton: {
    backgroundColor: "#6b5b95",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  appointButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  kickButton: {
    backgroundColor: "#ff4d4f",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  kickButtonText: {
    color: "white",
    fontWeight: "bold",
  },
})

export default UserProfileModal

