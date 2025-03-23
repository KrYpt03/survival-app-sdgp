import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import * as SecureStore from 'expo-secure-store';

export const SignOutButton = () => {
    // Use `useClerk()` to access the `signOut()` function
    const { signOut } = useClerk()

    const handleSignOut = async () => {
        try {
            // Sign out through Clerk
            await signOut()
            
            // Additional cleanup for persistent token storage
            try {
                // Clear any session tokens that might be stored
                const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
                const sessionTokenKey = `clerk.${publishableKey}.sessionToken`;
                await SecureStore.deleteItemAsync(sessionTokenKey);
            } catch (storageErr) {
                console.error('Error clearing session tokens:', storageErr);
                // Continue with redirect even if token cleanup fails
            }
            
            // Redirect to your desired page
            Linking.openURL(Linking.createURL('/'))
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error("Sign out error:", JSON.stringify(err, null, 2))
            
            // Even if sign out fails, try to redirect
            Linking.openURL(Linking.createURL('/'))
        }
    }

    return (
        <TouchableOpacity onPress={handleSignOut}>
            <Text>Sign out</Text>
        </TouchableOpacity>
    )
}