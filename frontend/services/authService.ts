import { useClerk, useSignIn, SignInResource } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

// Function to clear all auth tokens
export async function clearAuthTokens() {
  try {
    // Get all keys from SecureStore
    // Note: SecureStore doesn't have a getAll or listKeys method
    // We'll clear known Clerk keys instead
    
    // Try to extract publishable key from environment
    const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
    
    // Clear known Clerk token keys
    const tokenKeys = [
      `clerk.${publishableKey}.sessionToken`,
      'clerk.sessionToken',
      'clerk.deviceId',
      'clerk.lastSync'
    ];
    
    // Clear each potential token
    for (const key of tokenKeys) {
      await SecureStore.deleteItemAsync(key);
    }
    
    console.log('All auth tokens cleared');
    return true;
  } catch (error) {
    console.error('Error clearing auth tokens:', error);
    return false;
  }
}

// Function to safely sign in, handling single session errors
export async function safeSignIn(signIn: SignInResource, identifier: string, password: string, signOut: Function) {
  try {
    // First attempt to sign in directly
    const result = await signIn.create({
      identifier,
      password,
    });
    
    return result;
  } catch (error: any) {
    // Handle single session mode error
    if (error.message && error.message.includes('single session mode')) {
      console.log('Detected single session mode error, signing out and clearing tokens...');
      
      // First try normal sign out
      try {
        await signOut();
      } catch (signOutError) {
        console.error('Error during sign out:', signOutError);
        // Continue with token clearing anyway
      }
      
      // Then clear all auth tokens
      await clearAuthTokens();
      
      // Wait for a moment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Try signing in again
      try {
        const retryResult = await signIn.create({
          identifier,
          password,
        });
        
        return retryResult;
      } catch (retryError) {
        // If still failing, try one more aggressive approach
        console.error('Still having issues signing in, trying again after delay:', retryError);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Final attempt
        return await signIn.create({
          identifier,
          password,
        });
      }
    }
    
    // For other errors, rethrow
    throw error;
  }
} 