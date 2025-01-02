import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function App(): React.JSX.Element {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <ScrollView
        scrollEnabled={true}
        contentInsetAdjustmentBehavior='automatic'
      >
        <View
          style={{
            width: 390,
            height: 800,
            backgroundColor: '#ffffff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            borderBottomRightRadius: 30,
            borderBottomLeftRadius: 30,
            position: 'relative',
            overflow: 'hidden',
            marginTop: 0,
            marginRight: 'auto',
            marginBottom: 0,
            marginLeft: 'auto',
          }}
        >
          <ImageBackground
            style={{
              width: 1198,
              height: 977,
              position: 'absolute',
              top: -152,
              left: -9,
            }}
            source={require('../../assets/882a1e39-7619-4d2d-8934-01ec2145083f.png')}
            resizeMode='cover'
          />
          <View
            style={{
              width: 375,
              height: 812,
              position: 'absolute',
              top: 0,
              left: 0,
              overflow: 'hidden',
              zIndex: 9,
            }}
          >
            <View
              style={{
                width: 345.019,
                height: 30,
                position: 'relative',
                zIndex: 8,
                marginTop: 23,
                marginRight: 0,
                marginBottom: 0,
                marginLeft: 13,
              }}
            >
              <ImageBackground
                style={{
                  width: 29,
                  height: 30,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 8,
                }}
                source={require('../../assets/3d462754-0e3e-47dd-b69b-705f9825ed43.png')}
              />
              <ImageBackground
                style={{
                  width: 27.019,
                  height: 2,
                  position: 'absolute',
                  top: 1,
                  left: 318,
                  zIndex: 3,
                }}
                source={require('../../assets/598abff4-864b-4377-8e2a-cd4e76efea0d.png')}
                resizeMode='cover'
              />
              
              <Text
                style={{
                  display: 'flex',
                  height: 18,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  fontFamily: 'Poppins',
                  fontSize: 12,
                  fontWeight: '400',
                  lineHeight: 18,
                  color: '#202e5c',
                  position: 'absolute',
                  top: 6,
                  left: 34,
                  textAlign: 'left',
                  zIndex: 1,
                }}
                numberOfLines={1}
              >
                Hike here!
              </Text>
              <TouchableOpacity
              onPress={() => navigation.navigate('Loging' as never)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 20,
              }}
            >
              <Text
                style={{
                  display: 'flex',
                  height: 18,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  fontFamily: 'Poppins',
                  fontSize: 12,
                  fontWeight: '400',
                  lineHeight: 18,
                  color: '#345e40',
                  position: 'absolute',
                  top: 6,
                  left: 34,
                  textAlign: 'left',
                  zIndex: 6,
                }}
                numberOfLines={1}
              >
                Hike here!
              </Text>
              </TouchableOpacity>
              <ImageBackground
                style={{
                  width: 23,
                  height: 2,
                  position: 'absolute',
                  top: 7,
                  left: 322,
                  zIndex: 4,
                }}
                source={require('../../assets/66720931-0cfe-47fc-8b62-191ae762edc6.png')}
                resizeMode='cover'
              />
              <ImageBackground
                style={{
                  width: 18,
                  height: 2,
                  position: 'absolute',
                  top: 13,
                  left: 327,
                  zIndex: 5,
                }}
                source={require('../../assets/c64db674-2ded-4d72-a275-ced80266cff2.png')}
                resizeMode='cover'
              />
            </View>
            <Text
              style={{
                display: 'flex',
                width: 294,
                height: 64,
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: 'Mulish',
                fontSize: 36,
                fontWeight: '700',
                lineHeight: 45.18,
                color: '#000000',
                position: 'relative',
                textAlign: 'center',
                zIndex: 20,
                marginTop: 108,
                marginRight: 0,
                marginBottom: 0,
                marginLeft: 38,
              }}
              numberOfLines={1}
            >
              Sign Up
            </Text>
            <View
              style={{
                width: 319,
                height: 63,
                position: 'relative',
                zIndex: 12,
                marginTop: 28,
                marginRight: 0,
                marginBottom: 0,
                marginLeft: 28,
              }}
            >
              <Text
                style={{
                  display: 'flex',
                  width: 288,
                  height: 63,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  fontFamily: 'Mulish',
                  fontSize: 18,
                  fontWeight: '400',
                  lineHeight: 22.59,
                  color: '#241c1c',
                  position: 'relative',
                  textAlign: 'left',
                  zIndex: 12,
                  marginTop: 20,
                  marginRight: 0,
                  marginBottom: 0,
                  marginLeft: 16,
                }}
              >
                Email
              </Text>
              <View
                style={{
                  width: 319,
                  height: 63,
                  backgroundColor: '#f5f4f2',
                  borderTopLeftRadius: 31.5,
                  borderTopRightRadius: 31.5,
                  borderBottomRightRadius: 31.5,
                  borderBottomLeftRadius: 31.5,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 10,
                }}
              />
            </View>
            <View
              style={{
                width: 319,
                height: 63,
                position: 'relative',
                zIndex: 13,
                marginTop: 22,
                marginRight: 0,
                marginBottom: 0,
                marginLeft: 28,
              }}
            >
              <Text
                style={{
                  display: 'flex',
                  width: 288,
                  height: 63,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  fontFamily: 'Mulish',
                  fontSize: 18,
                  fontWeight: '400',
                  lineHeight: 22.59,
                  color: '#241c1c',
                  position: 'relative',
                  textAlign: 'left',
                  zIndex: 13,
                  marginTop: 20,
                  marginRight: 0,
                  marginBottom: 0,
                  marginLeft: 16,
                }}
              >
                Password
              </Text>
              <View
                style={{
                  width: 319,
                  height: 63,
                  backgroundColor: '#f5f4f2',
                  borderTopLeftRadius: 31.5,
                  borderTopRightRadius: 31.5,
                  borderBottomRightRadius: 31.5,
                  borderBottomLeftRadius: 31.5,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 11,
                }}
              />
            </View>
            <View
              style={{
                width: 319,
                height: 63,
                borderTopLeftRadius: 31.5,
                borderTopRightRadius: 31.5,
                borderBottomRightRadius: 31.5,
                borderBottomLeftRadius: 31.5,
                position: 'relative',
                zIndex: 14,
                marginTop: 22,
                marginRight: 0,
                marginBottom: 0,
                marginLeft: 28,
              }}
            >
              <Text
                style={{
                  display: 'flex',
                  width: 100,
                  height: 43,
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontFamily: 'Mulish',
                  fontSize: 18,
                  fontWeight: '700',
                  lineHeight: 22.59,
                  color: '#f5f4f2',
                  position: 'relative',
                  textAlign: 'center',
                  zIndex: 16,
                  marginTop: 20,
                  marginRight: 0,
                  marginBottom: 0,
                  marginLeft: 110,
                }}
              >
                SIGN UP
              </Text>
              <View
                style={{
                  width: 319,
                  height: 63,
                  backgroundColor: '#241c1c',
                  borderTopLeftRadius: 31.5,
                  borderTopRightRadius: 31.5,
                  borderBottomRightRadius: 31.5,
                  borderBottomLeftRadius: 31.5,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 15,
                }}
              />
            </View>
            <View
              style={{
                width: 319,
                height: 63,
                borderTopLeftRadius: 31.5,
                borderTopRightRadius: 31.5,
                borderBottomRightRadius: 31.5,
                borderBottomLeftRadius: 31.5,
                position: 'relative',
                zIndex: 17,
                marginTop: 7,
                marginRight: 0,
                marginBottom: 0,
                marginLeft: 28,
              }}
            >
              <Text
                style={{
                  display: 'flex',
                  width: 234,
                  height: 43,
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontFamily: 'Mulish',
                  fontSize: 18,
                  fontWeight: '400',
                  lineHeight: 22.59,
                  color: '#241c1c',
                  position: 'relative',
                  textAlign: 'center',
                  zIndex: 19,
                  marginTop: 20,
                  marginRight: 0,
                  marginBottom: 0,
                  marginLeft: 43,
                }}
              >
                Log in
              </Text>
              <View
                style={{
                  width: 319,
                  height: 63,
                  backgroundColor: 'rgba(200, 196, 183, 0.72)',
                  borderTopLeftRadius: 31.5,
                  borderTopRightRadius: 31.5,
                  borderBottomRightRadius: 31.5,
                  borderBottomLeftRadius: 31.5,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 18,
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}