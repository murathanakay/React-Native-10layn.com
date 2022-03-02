import React from "react";
import { Text, View, ActivityIndicator, StyleSheet } from "react-native";
import { useColorScheme } from "react-native-appearance";
import { getDeviceTheme } from "../../helpers/Functions";

const FooterIndicator = React.memo(({ loadingMore, error, ...props }) => {
  const colorScheme = useColorScheme();
  const isLight = getDeviceTheme(colorScheme) === "light";

  // console.log(loadingMore);

  if (!loadingMore) return null;
  if (error) return null;

  return (
    <View
      style={[
        {
          paddingVertical: 20,
          borderTopWidth: 1,
          display: "flex",
          alignContent: "center",
          alignItems: "center",
          borderColor: isLight ? "rgba(0,0,0,.15)" : "rgba(0,0,0,.15)",
        },
        { ...props.style },
      ]}
    >
      <ActivityIndicator
        animating
        size="large"
        color={isLight ? "#000" : "#eee"}
      />
      {!props.hideText && (
        <Text style={{ color: isLight ? "#000" : "#eee" }}>Yükleniyor...</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({});

export default FooterIndicator;
