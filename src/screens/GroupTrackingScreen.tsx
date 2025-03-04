import type React from "react"
import { useState } from "react"
import { View, StyleSheet, Button } from "react-native"
import MapView, { Circle } from "react-native-maps"

// Fix for Marker typing issue
import { Marker as RawMarker } from "react-native-maps"
const Marker = RawMarker as unknown as React.FC<any>

import AlertPopup from "../components/AlertPopup"
import NavigationBar from "../components/NavigationBar"

interface GroupMember {
    id: number
    name: string
    latitude: number
    longitude: number
}

const GroupTrackingScreen: React.FC = () => {
    const [showWarning, setShowWarning] = useState<boolean>(false)

    const groupMembers: GroupMember[] = [
        { id: 1, name: "Member 1", latitude: 6.8, longitude: 80.8 },
        { id: 2, name: "Member 2", latitude: 6.81, longitude: 80.81 },
    ]

    return (
        <View style={styles.container}>
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
                        pinColor="red"
                        title={member.name}
                    />
                ))}
            </MapView>

            {showWarning && (
                <AlertPopup
                    title="Warning!"
                    message="Member 1 has moved outside the designated operational zone."
                    onClose={() => setShowWarning(false)}
                />
            )}

            <View style={styles.endButtonContainer}>
                <Button title="End" color="red" onPress={() => console.log("Tracking Ended")} />
            </View>

            {/* Add the NavigationBar component */}
            <NavigationBar />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },
    map: {
        flex: 1,
    },
    endButtonContainer: {
        position: "absolute",
        bottom: 90, // This position accounts for the NavigationBar height
        right: 20,
        backgroundColor: "red",
        padding: 10,
        borderRadius: 20,
    },
})

export default GroupTrackingScreen

