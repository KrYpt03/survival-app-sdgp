import React from "react"
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native"
import { X } from "lucide-react-native"
import { useNavigation } from "@react-navigation/native"

interface UserProfileModalProps {
  username: string
  onClose: () => void
  onKick?: () => void
  onAppointLeader?: () => void
  showLeaderOption?: boolean
  isRegularUserView?: boolean
  children?: React.ReactNode
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  username,
  onClose,
  onKick,
  onAppointLeader,
  showLeaderOption = false,
  isRegularUserView = false,
  children,
}) => {
  const navigation = useNavigation()

  const handleKick = () => {
    onClose()
    if (onKick) onKick()
    // navigation.navigate("KickedScreen" as never)
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.profileHeader}>
          {children || (
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
              style={styles.profileImage}
            />
          )}
          <Text style={styles.username}>{username}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Years</Text>
          </View>
        </View>

        <View style={styles.bioContainer}>
          <Text style={styles.bioTitle}>About</Text>
          <Text style={styles.bioText}>
            Experienced hiker and nature enthusiast. Loves exploring new trails and capturing beautiful landscapes.
          </Text>
        </View>

        {!isRegularUserView && (
          <View style={styles.actionButtons}>
            {showLeaderOption && (
              <TouchableOpacity style={styles.appointButton} onPress={onAppointLeader}>
                <Text style={styles.appointButtonText}>Appoint as Leader</Text>
              </TouchableOpacity>
            )}
            {onKick && (
              <TouchableOpacity style={styles.kickButton} onPress={handleKick}>
                <Text style={styles.kickButtonText}>Kick from Group</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {isRegularUserView && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.messageButton} onPress={onClose}>
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        )}
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
    height: "60%",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  bioContainer: {
    marginBottom: 20,
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  bioText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  actionButtons: {
    marginTop: 10,
  },
  appointButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  appointButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  kickButton: {
    backgroundColor: "#ff4d4f",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  kickButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  messageButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  messageButtonText: {
    color: "white",
    fontWeight: "bold",
  },
})

export default UserProfileModal
