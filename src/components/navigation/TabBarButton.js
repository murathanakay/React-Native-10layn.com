import React from "react";
import { View, TouchableNativeFeedback } from "react-native";
import { useColorScheme } from "react-native-appearance";
import { getDeviceTheme } from "../../helpers/Functions";
import { Feather } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import FavoriteIcon from "../../assets/favorites.json";

const TabBarButton = ({ icon, mainNavColor, barColor, ...props }) => {
  const theme = getDeviceTheme(useColorScheme());

  // console.log("theme", props);

  const {
    activeTintColor,
    inactiveTintColor,
    accessibilityLabel,
    route,
    focused,
    onPress,
  } = props;

  // console.log(activeTintColor, inactiveTintColor, theme);

  const routeIndex = route.index;
  const tintColor = focused ? activeTintColor[theme] : inactiveTintColor[theme];

  // console.log(tintColor);

  // console.log("tint", barColor);
  return (
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple("transparent")}
      key={routeIndex}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 15,
      }}
      onPress={() => {
        onPress({ route });
      }}
      onLongPress={() => {
        onTabLongPress({ route });
      }}
      accessibilityLabel={accessibilityLabel}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: barColor[theme],
        }}
      >
        {route.key === "Favorite" && !focused ? (
          <LottieView
            ref={(animation) => {
              global.heartAnimation = animation;
            }}
            style={{
              width: 56,
              height: 56,
            }}
            loop={false}
            speed={1.5}
            source={FavoriteIcon}
            progress={0}
            // OR find more Lottie files @ https://lottiefiles.com/featured
            // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
          />
        ) : (
          <Feather name={icon} size={24} color={tintColor} />
        )}
        {/* {renderIcon({ route, focused, tintColor })} */}
      </View>
    </TouchableNativeFeedback>
  );
};

export default TabBarButton;
