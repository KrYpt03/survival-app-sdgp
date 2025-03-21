import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"

interface AlertPopupProps {
  title: string
  message: string
  onClose: () => void
}

const AlertPopup: React.FC<AlertPopupProps> = ({ title, message, onClose }) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.alertContainer}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
    zIndex: 100,
  },
  alertContainer: {
    backgroundColor: "#ffdddd",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  message: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  closeText: {
    color: "#8b0000",
    fontSize: 16,
    fontWeight: "500",
  },
})

export default AlertPopup

