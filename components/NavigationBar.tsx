import React from "react"
import { View, TouchableOpacity, StyleSheet, ImageBackground } from "react-native"
import { useNavigation } from "@react-navigation/native"

const navigationItems = [
    {
        icon: require("../assets/images/profile/4757d4cc-108a-4570-8e32-ac0514f1c5b2.png"),
        screen: "Home",
    },
    {
        icon: require("../assets/images/profile/0d19fe1c-1a37-4dc8-a582-9441af5ef8c5.png"),
        screen: "Search",
    },
    {
        icon: require("../assets/images/profile/bd137700-8dc1-48fb-92c2-08643c077010.png"),
        screen: "GroupTrackingScreen",
    },
    {
        icon: require("../assets/images/profile/0415227a-9b94-4632-a21b-4c46d2f8432c.png"),
        screen: "Inbox",
    },
    {
        icon: require("../assets/images/profile/46f352d9-70f6-4c9e-886c-768bcf1746b8.png"),
        screen: "Profile",
    },
]

const NavigationBar: React.FC = () => {
    const navigation = useNavigation()

    const handleNavigate = (screen: string) => {
        navigation.navigate(screen as never)
    }

    return (
        <View style={styles.navigationBar}>
            {navigationItems.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => handleNavigate(item.screen)}>
                    <ImageBackground source={item.icon} style={styles.navIcon} resizeMode="cover" />
                </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    navigationBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#f3edf7",
        borderRadius: 25,
        margin: 16,
        padding: 16,
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
    },
    navIcon: {
        width: 24,
        height: 24,
    },
})

export default NavigationBar