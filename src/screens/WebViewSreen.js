import React, { useState, useRef } from "react";
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

import {
  getDefaultColor,
  getDeviceTheme,
  isLightTheme,
} from "../helpers/Functions";
import getStyleSheet from "../styles/BaseStyles";
import { Logo } from "../components/common/svg/Logo";
import { Feather } from "@expo/vector-icons";
import { Header } from "react-native-elements";
import WebView from "react-native-webview";

const WebViewScreen = React.memo(({ navigation }) => {
  const [loaded, setLoaded] = useState(false);
  const colorScheme = useColorScheme();
  const Styles = getStyleSheet(colorScheme);
  const isLight = isLightTheme(colorScheme);

  const headerElementOffset = Constants.statusBarHeight + 32;

  const { url } = navigation.state.params;
  const webviewRef = useRef(null);
  return (
    <>
      <Header
        barStyle={isLight ? "dark-content" : "light-content"}
        backgroundColor={getDefaultColor(colorScheme, false)}
        leftComponent={false}
        centerComponent={
          <View style={{ height: 32 }}>
            <Logo width={32} height={32} isLight={isLight} />
          </View>
        }
        containerStyle={{
          borderBottomColor: isLight
            ? "rgba(0,0,0,.15)"
            : "rgba(255,255,255,.15)",
          paddingVertical: 5,
        }}
        rightContainerStyle={{
          overflow: "hidden",
          position: "relative",
        }}
        rightComponent={
          <View
            style={{
              paddingRight: 10,
              paddingTop: 2,
              position: "absolute",
              zIndex: 2,
            }}
          >
            {!loaded ? (
              <ActivityIndicator
                animating
                size={30}
                color={getDefaultColor(colorScheme, true)}
              />
            ) : (
              <Pressable onPress={() => navigation.pop()}>
                <Feather name="x" size={28} color="white" />
              </Pressable>
            )}
          </View>
        }
      />
      <SafeAreaView style={styles.flexContainer}>
        <WebView
          style={{
            backgroundColor: "#000",
          }}
          source={{ uri: url }}
          allowsFullscreenVideo={false}
          mediaPlaybackRequiresUserAction={true}
          onError={console.log("errorr")}
          onLoadEnd={() => setLoaded(true)}
          ref={webviewRef}
          onNavigationStateChange={(event) => {
            if (event.url !== encodeURI(url)) {
              webviewRef.current.stopLoading();
            }
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
