import React, {useState} from "react";
import{
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ImageBackground,
    Dimensions,
}from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function VerifyEmailScreen(){
    const navigation = useNavigation();
    const { signUp, isLoaded } = useSignUp();
    const [code, setCode] = useState("");

    const handleVerifyEmail = async () => {
        if(!isLoaded || !signUp) return;
        
        try{
            await signUp.attemptEmailAddressVerification({code});
            Alert.alert("Success", "Email verified successfully");

            navigation.navigate("Loging" as never);
        }catch(err: any){
            Alert.alert("Error", err.errors ? err.errors[0].message : "Email verification failed");
        }
    };

    return (
        <ImageBackground
                source={require("../../assets/882a1e39-7619-4d2d-8934-01ec2145083f.png")}
                style={styles.backgroundImage}
                resizeMode="cover"
              >
        <View style={styles.container}>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.instructions}>
            Enter the 6-digit code sent to your email:
          </Text>
    
          <TextInput
            style={styles.input}
            placeholder="Enter verification code"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            placeholderTextColor="#666"
          />
    
          <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyEmail}>
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>
        </View>
        </ImageBackground>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
      },
      title: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 20,
        color: "#000",
      },
      instructions: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
        color: "#666",
      },
      input: {
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 18,
        marginBottom: 16,
        width: "100%",
        textAlign: "center",
        borderColor: "#ccc",
        borderWidth: 1,
      },
      verifyButton: {
        backgroundColor: "#241c1c",
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
        width: "100%",
      },
      verifyButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
      },
      backgroundImage: {
        flex: 1,
        width: width,
        height: height,
      },
    });
