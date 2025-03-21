"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, StatusBar } from "react-native"
import MapView, { Circle, Marker } from "react-native-maps"
import { useNavigation } from "@react-navigation/native"
import { ArrowLeft, Bell } from "lucide-react-native"
import NavigationBar from "../components/NavigationBar"
import AlertPopup from "../components/AlertPopup"
import UserProfileModal from "../components/UserProfileModal"

interface GroupMember {
  id: number
  name: string
  latitude: number
  longitude: number
  isOutsideZone?: boolean
}

const GroupTrackingScreen: React.FC = () => {
  const navigation = useNavigation()
  const [showWarning, setShowWarning] = useState<boolean>(false)
  const [showKickedAlert, setShowKickedAlert] = useState<boolean>(false)
  const [showLeaderNotification, setShowLeaderNotification] = useState<boolean>(false)
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null)
  const [showUserProfile, setShowUserProfile] = useState<boolean>(false)
  const [isLeader, setIsLeader] = useState<boolean>(true)

  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([
    { id: 1, name: "Thisara", latitude: 6.799, longitude: 80.798 },
    { id: 2, name: "Kevin", latitude: 6.798, longitude: 80.808 },
    { id: 3, name: "Akindu", latitude: 6.797, longitude: 80.815 },
  ])