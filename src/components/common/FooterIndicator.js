import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useColorScheme } from "react-native-appearance";
import { getDeviceTheme } from "../../helpers/Functions";

const FooterIndicator = React.memo(({ loadingMore, error }) => {
  const colorScheme = useColorScheme();
  // const Styles = getStyleSheet(colorScheme);

  const isLight = getDeviceTheme(colorScheme) === "light";

  // console.log(loadingMore);

  if (!loadingMore) return null;
  if (error) return null;

  return (
    <View
      style={{
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: isLight ? "rgba(0,0,0,.15)" : "rgba(0,0,0,.15)",
      }}
    >
      <ActivityIndicator
        animating
        size="large"
        color={isLight ? "#000" : "#eee"}
      />
    </View>
  );
});

const styles = StyleSheet.create({});

export default FooterIndicator;
