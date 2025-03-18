import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { ClerkProvider } from '@clerk/clerk-expo';

const CLERK_PUBLISHABLE_KEY = "pk_test_cmVuZXdlZC1ncm91c2UtNTAuY2xlcmsuYWNjb3VudHMuZGV2JA";

export default function App() {
  return( 
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <AppNavigator />
    </ClerkProvider>
  );
}
