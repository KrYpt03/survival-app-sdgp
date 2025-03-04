import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BottomNavBar: React.FC = () => {
    return (
        <View style={styles.navbar}>
            <TouchableOpacity><Ionicons name="home" size={24} /></TouchableOpacity>
            <TouchableOpacity><Ionicons name="search" size={24} /></TouchableOpacity>
            <TouchableOpacity><Ionicons name="camera" size={24} /></TouchableOpacity>
            <TouchableOpacity><Ionicons name="person" size={24} /></TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
});

export default BottomNavBar;
