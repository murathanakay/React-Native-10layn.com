import React, { useEffect, useState } from "react";
import { Platform, Keyboard, StyleSheet, View, Pressable } from "react-native";
// import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs/lib/typescript/src/types";
import { Feather as Icon } from "@expo/vector-icons";
import { TabBg } from "./svg/TabBg";

// type Props = BottomTabBarButtonProps & {
//   bgColor?: string,
// };

const TabBarAdvancedButton = ({ bgColor, ...props }) => {
  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  const [keyboardStatus, setKeyboardStatus] = useState(undefined);
  const _keyboardDidShow = () => setKeyboardStatus(true);
  const _keyboardDidHide = () => setKeyboardStatus(false);

  return (
    <View
      style={[
        styles.container,
        { opacity: keyboardStatus && Platform.OS !== "ios" ? 0 : 1 },
      ]}
      pointerEvents="box-none"
    >
      <TabBg color={bgColor} style={styles.background} />
      <View style={styles.buttonContainer}>
        <Pressable
          android_ripple={{ color: "black", radius: 27, borderless: true }}
          style={styles.button}
          onPress={props.onPress}
        >
          <Icon name="search" style={styles.buttonIcon} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: 94,
    alignItems: "center",
  },
  background: {
    position: "absolute",
    top: 0,
  },
  buttonContainer: {
    top: -19.5,
    borderRadius: 37,
    justifyContent: "center",
    // elevation: 25,
    alignItems: "center",
    width: 60,
    height: 60,
    backgroundColor: "#6d2673",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,.5)",
    // shadow
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
  },
  buttonIcon: {
    fontSize: 24,
    color: "#fff",
  },
});

export default TabBarAdvancedButton;
