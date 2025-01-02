import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native';
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
            width: 375,
            height: 812,
            position: 'relative',
            marginTop: 0,
            marginRight: 'auto',
            marginBottom: 0,
            marginLeft: 'auto',
          }}
        >
          <View
            style={{
              width: 375,
              height: 812,
              backgroundColor: '#ffffff',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              borderBottomRightRadius: 30,
              borderBottomLeftRadius: 30,
              position: 'absolute',
              top: 0,
              left: 0,
              overflow: 'hidden',
              zIndex: 1,
            }}
          >
            <ImageBackground
              style={{
                width: 1198,
                height: 977,
                position: 'absolute',
                top: -152,
                left: -9,
                zIndex: 2,
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
                left: 6,
                zIndex: 4,
              }}
            >
              <View
                style={{
                  width: 375,
                  height: 812,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 5,
                }}
              >
                <View
                  style={{
                    width: 375,
                    height: 812,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    overflow: 'hidden',
                    zIndex: 6,
                  }}
                >
                <TouchableOpacity
                onPress={() => navigation.navigate('Loging' as never)}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 20,
                }}
                >
                  <ImageBackground
                    style={{
                      width: 29,
                      height: 29,
                      position: 'relative',
                      zIndex: 14,
                      marginTop: 23,
                      marginRight: 0,
                      marginBottom: 0,
                      marginLeft: 20,
                    }}
                    source={require('../../assets/arrow-small-left.png')}
                  />
                </TouchableOpacity>
                  <Text
                    style={{
                      display: 'flex',
                      width: 324,
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
                      zIndex: 13,
                      marginTop: 109,
                      marginRight: 0,
                      marginBottom: 0,
                      marginLeft: 23,
                    }}
                    numberOfLines={1}
                  >
                    Reset Password
                  </Text>
                  <View
                    style={{
                      width: 319,
                      height: 63,
                      borderTopLeftRadius: 31.5,
                      borderTopRightRadius: 31.5,
                      borderBottomRightRadius: 31.5,
                      borderBottomLeftRadius: 31.5,
                      position: 'relative',
                      zIndex: 10,
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
                        marginTop: 18,
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
                      zIndex: 7,
                      marginTop: 21,
                      marginRight: 0,
                      marginBottom: 0,
                      marginLeft: 28,
                    }}
                  >
                    <TouchableOpacity
                onPress={() => navigation.navigate('SignUp' as never)}
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
                        width: 270,
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
                        zIndex: 9,
                        marginTop: 20,
                        marginRight: 0,
                        marginBottom: 0,
                        marginLeft: 25,
                      }}
                    >
                      REQUEST RESET
                    </Text>
                    </TouchableOpacity>
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
                        zIndex: 8,
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
            <ImageBackground
              style={{
                width: 29,
                height: 30,
                position: 'absolute',
                top: 20,
                left: 320,
                right: 0,
                zIndex: 8,
              }}
              source={require('../../assets/3d462754-0e3e-47dd-b69b-705f9825ed43.png')}
              resizeMode='cover'
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
