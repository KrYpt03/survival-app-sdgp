import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import React, { useState } from 'react'
import { Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import * as SecureStore from 'expo-secure-store';
import { clearAuthTokens } from '../services/authService';

export const SignOutButton = () => {
    const [isSigningOut, setIsSigningOut] = useState(false);
    // Use `useClerk()` to access the `signOut()` function
    const { signOut } = useClerk()

    const handleSignOut = async () => {
        if (isSigningOut) return; // Prevent multiple clicks
        
        setIsSigningOut(true);
        
        try {
            // First try to clear all auth tokens
            await clearAuthTokens();
            
            // Brief delay to ensure token clearing takes effect
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Now try to sign out through Clerk
            await signOut();
            
            console.log("Sign out successful");
            
            // Redirect to your desired page
            Linking.openURL(Linking.createURL('/'))
        } catch (err) {
            console.error("Sign out error:", JSON.stringify(err, null, 2));
            
            // If normal sign out fails, try more aggressive approach
            try {
                // Try to clear session tokens directly
                console.log("Trying alternative sign out approach...");
                
                // Additional aggressive cleanup
                try {
                    const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
                    await SecureStore.deleteItemAsync(`clerk.${publishableKey}.sessionToken`);
                    await SecureStore.deleteItemAsync('clerk.deviceId');
                    await SecureStore.deleteItemAsync('clerk.lastSync');
                } catch (storageErr) {
                    console.error('Error clearing tokens:', storageErr);
                }
                
                // Wait longer
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Try Clerk signOut again
                await signOut();
            } catch (secondError) {
                console.error("Alternative sign out also failed:", secondError);
            } finally {
                // Even if everything fails, still redirect
                Linking.openURL(Linking.createURL('/'));
            }
        } finally {
            setIsSigningOut(false);
        }
    }

    return (
        <TouchableOpacity onPress={handleSignOut} disabled={isSigningOut} style={styles.button}>
            {isSigningOut ? (
                <ActivityIndicator color="#555" size="small" />
            ) : (
                <Text style={styles.text}>Sign out</Text>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
    },
    text: {
        color: '#333',
        fontSize: 16,
    }
});