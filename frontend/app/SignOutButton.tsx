import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { StyleSheet } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export const SignOutButton = () => {
    // Use `useClerk()` to access the `signOut()` function
    const { signOut } = useClerk()

    const handleSignOut = async () => {
        try {
            await signOut()
            // Redirect to your desired page
            Linking.openURL(Linking.createURL('/'))
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    return (
        <TouchableOpacity  onPress={handleSignOut} 
        style={{ 
            
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            marginBottom: 10,
            borderWidth: 2,
            borderColor: '#ddd', 
            borderRadius: 10, 
    }}>
            <MaterialIcons name="logout" size={24} color="black" style={{ marginLeft: 100}} />
            <Text style={{ fontSize: 20 ,marginLeft: 10,}}>Sign out</Text>
        </TouchableOpacity>
    )
}
