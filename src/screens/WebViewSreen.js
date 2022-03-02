import React from "react";
import {
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
} from "react-native";
import Constants from "expo-constants";
import { useColorScheme } from "react-native-appearance";
import { getDefaultColor, getDeviceTheme } from "../helpers/Functions";
import { Feather } from "@expo/vector-icons";
import { Header } from "react-native-elements";
import WebView from "react-native-webview";

const WebViewScreen = React.memo(({ navigation }) => {
  const colorScheme = useColorScheme();

  const headerElementOffset = Constants.statusBarHeight + 32;

  const { url } = navigation.state.params;
  return (
    <>
      <Header
        statusBarProps={{
          hidden: false, //Platform.OS === "android" ? false : true,
          animated: false,
          showHideTransition: "none",
          translucent: true,
          backgroundColor: "transparent",
        }}
        barStyle={getDefaultColor(colorScheme, true)}
        backgroundColor={getDefaultColor(colorScheme, false)}
        leftContainerStyle={{
          flex: 0,
          padding: 0,
        }}
        leftComponent={
          <Pressable
            onPress={() => navigation.pop()}
            style={{ paddingRight: 0, flex: 0 }}
          >
            <Feather
              name="chevron-left"
              size={29}
              color={getDefaultColor(colorScheme, true)}
            />
          </Pressable>
        }
        centerComponent={
          <Pressable onPress={() => navigation.pop()}>
            <Text
              style={{
                color: getDefaultColor(colorScheme, true),
                fontSize: 18,
                fontFamily: "Montserrat-SemiBold",
                flex: 1,
                alignContent: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              Geri
            </Text>
          </Pressable>
        }
        centerContainerStyle={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          alignContent: "center",
        }}
        containerStyle={{
          borderBottomWidth: 0,
          paddingVertical: 0,
          marginTop: "auto",
          marginBottom: 10,
          alignItems: "flex-end",
          height: headerElementOffset,
          zIndex: 222,
          position: "relative",
        }}
      />
      <SafeAreaView style={styles.flexContainer}>
        <WebView
          source={{ uri: url }}
          allowsFullscreenVideo={false}
          mediaPlaybackRequiresUserAction={true}
          onError={console.log("errorr")}
          renderLoading={() => {
            return (
              <View
                style={{
                  paddingTop: 20,
                  borderTopWidth: 1,
                  borderColor: "rgba(0,0,0,.15)",
                }}
              >
                <ActivityIndicator
                  animating
                  size="large"
                  color={getDefaultColor(colorScheme, true)}
                />
              </View>
            );
          }}
          startInLoadingState
        />
      </SafeAreaView>
    </>
  );
});
const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
});
export default WebViewScreen;
