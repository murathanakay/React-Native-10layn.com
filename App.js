import React, { useState } from "react";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";
// import { enableScreens } from "react-native-screens";

import { StyleSheet, TextPropTypes, View } from "react-native";
import { Provider } from "./src/context/BlogContext";
import { AppearanceProvider, useColorScheme } from "react-native-appearance";
import { useFonts } from "expo-font";
import { createAppContainer } from "react-navigation";
import AnimatedSplash from "react-native-animated-splash-screen";
import {
  createStackNavigator,
  TransitionPresets,
  TransitionSpecs,
  CardStyleInterpolators,
} from "react-navigation-stack";
import { createBottomTabNavigator, BottomTabBar } from "react-navigation-tabs";
import IndexScreen from "./src/screens/IndexScreen";
import SearchScreen from "./src/screens/SearchScreen";
import MemoizedCategoryScreen from "./src/screens/CategoryScreen";
import FavoriteScreen from "./src/screens/FavoriteScreen";
import SettingScreen from "./src/screens/SettingScreen";
import ShowScreen from "./src/screens/ShowScreen";
import ShowbyLinkScreen from "./src/screens/ShowbyLinkScreen";
import TagShowScreen from "./src/screens/TagShowScreen";
import { Feather } from "@expo/vector-icons";
import CategoryTabs from "./src/components/navigation/CategoryTabs";
import { IS_IPHONE_X } from "./src/utils/navbar";
import TabBarButton from "./src/components/navigation/TabBarButton";
import TabBarAdvancedButton from "./src/components/navigation/TabBarAdvancedButton";
import { getDeviceTheme } from "./src/helpers/Functions";
import SharedScreen from "./src/screens/SharedScreen";
import WebViewScreen from "./src/screens/WebViewSreen";
// import io from "socket.io-client";

// enableScreens();

const prefix = Linking.createURL("/");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  navigatorContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.32,
    shadowRadius: 2.22,
  },
  navigator: {
    borderTopWidth: 0,
    backgroundColor: "transparent",
    elevation: 100,
    bottom: 0,
  },
  xFillLine: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 34,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const CustomThemeColors = {
  mainNavColor: {
    inactiveTintColor: {
      dark: "#999",
      light: "#999",
    },
    activeTintColor: {
      dark: "#FFF",
      light: "black",
    },
  },

  categoryTabColors: {
    inactiveTintColor: {
      dark: "#444",
      light: "#999",
    },
    activeTintColor: {
      dark: "#FFFFFF",
      light: "black",
    },
  },

  barColor: {
    dark: "#000",
    light: "#FFFFFF",
  },
};

const CategoryTabColors = {
  inactiveTintColor: {
    dark: "#999",
    light: "#999",
  },
  activeTintColor: {
    dark: "#FFFFFF",
    light: "black",
  },

  navBarBgColor: {
    dark: "#000",
    light: "#FFFFFF",
  },
};

const bottomTabBarOptions = {
  backBehavior: "history",
  showIcon: true,
  showLabel: false,
  style: styles.navigator,
  keyboardHidesTabBar: true,
};

const CategoryStack = createStackNavigator(
  {
    Categories: CategoryTabs,
  },
  {
    navigationOptions: {
      gestureEnabled: true,
      // cardOverlayEnabled: true,
      ...TransitionPresets.SlideFromRightIOS,
    },
    // navigationOptions: {},
    defaultNavigationOptions: {
      headerShown: false,
      // gestureDirection: "vertical",
    },
  },
);

const switchNavigator = createStackNavigator(
  {
    mainNavFlow: createBottomTabNavigator(
      {
        Index: {
          screen: IndexScreen,
          navigationOptions: ({ navigation, screenProps }) => ({
            tabBarLabel: "",
            tabBarButtonComponent: (props) => {
              return (
                <TabBarButton
                  icon="home"
                  {...CustomThemeColors.mainNavColor}
                  barColor={CustomThemeColors.barColor}
                  {...props}
                />
              );
            },

            tabBarOnPress: (obj) => {
              const { navigation } = obj;

              const { isFocused, getParam } = navigation;
              if (isFocused()) {
                navigation.getParam("scrollTopMe")();
              } else obj.navigation.navigate("Index");
            },

            // tabBarOnPress: (obj) => obj.navigation.navigate("Index"),
          }),
        },

        Category: {
          screen: MemoizedCategoryScreen,
          navigationOptions: (props) => {
            return {
              tabBarLabel: "",
              tabBarButtonComponent: (props) => {
                return (
                  <TabBarButton
                    icon="layers"
                    {...CustomThemeColors.mainNavColor}
                    barColor={CustomThemeColors.barColor}
                    {...props}
                  />
                );
              },
              // tabBarOnPress: (obj) => obj.navigation.navigate("Category"),
            };
          },
        },

        SearchButton: {
          screen: SearchScreen,
          // path: "search/:query",
          navigationOptions: {
            transitionSpec: {
              open: TransitionSpecs.TransitionIOSSpec,
              close: TransitionSpecs.TransitionIOSSpec,
            },
            cardStyleInterpolator:
              CardStyleInterpolators.forModalPresentationIOS,
            tabBarButtonComponent: (props) => {
              const theme = useColorScheme();
              return (
                <View>
                  <TabBarAdvancedButton
                    bgColor={
                      CategoryTabColors.navBarBgColor[getDeviceTheme(theme)]
                    }
                    theme={theme}
                    {...props}
                  />
                </View>
              );
            },
            tabBarLabel: "",
            tabBarIcon: ({ tintColor }) => {
              return <Feather name="search" size={24} color={tintColor} />;
            },
            // tabBarOnPress: (obj) => obj.navigation.navigate("Search"),
          },
        },

        Favorite: {
          screen: FavoriteScreen,
          navigationOptions: () => {
            return {
              tabBarButtonComponent: (props) => {
                return (
                  <TabBarButton
                    icon="heart"
                    {...CustomThemeColors.mainNavColor}
                    barColor={CustomThemeColors.barColor}
                    {...props}
                  />
                );
              },
              tabBarLabel: "",
              // tabBarOnPress: (obj) => obj.navigation.navigate("Favorite"),
            };
          },
        },

        Setting: {
          screen: SettingScreen,
          navigationOptions: {
            tabBarLabel: "",
            // tabBarIcon: ({ tintColor }) => {
            //   return <Feather name="settings" size={24} color={tintColor} />;
            // },
            tabBarButtonComponent: (props) => {
              return (
                <TabBarButton
                  icon="settings"
                  {...CustomThemeColors.mainNavColor}
                  barColor={CustomThemeColors.barColor}
                  {...props}
                />
              );
            },
            tabBarOnPress: (obj) => obj.navigation.navigate("Setting"),
          },
        },
      },
      {
        tabBarComponent: (props) => {
          let theme = useColorScheme();
          // alert(theme);
          return (
            <View
              style={[
                styles.navigatorContainer,
                {
                  shadowColor:
                    getDeviceTheme(theme) === "dark" ? "white" : "#000",
                },
              ]}
            >
              <BottomTabBar {...props} />
              {IS_IPHONE_X && (
                <View
                  style={[
                    styles.xFillLine,
                    {
                      backgroundColor:
                        CategoryTabColors.navBarBgColor[getDeviceTheme(theme)],
                    },
                  ]}
                />
              )}
            </View>
          );
        },
        // tabBarPosition: "bottom",
        backBehavior: "initialRoute",
        lazy: true,
        tabBarOptions: bottomTabBarOptions,
        // detachInactiveScreens: false,
      },
    ),
    categoriesFlow: CategoryStack,
    Show: {
      screen: ShowScreen,
      path: "/post/:id",
      navigationOptions: {
        headerShown: false,
      },
    },
    //show shared post deep linking
    //redirected from our 10layn.com server with ie: <script>window.location.replace("onlayn://post/ID_OF_THE_POST");</script>
    ShowByLink: {
      screen: ShowbyLinkScreen,
      path: "/post/:id",
      navigationOptions: {
        headerShown: false,
      },
    },
    TagShowScreen,
    WebView: {
      screen: WebViewScreen,
      params: { url: null },
      navigationOptions: {
        headerShown: true,
        ...TransitionPresets.RevealFromBottomAndroid,
        cardOverlayEnabled: true,
        gestureEnabled: true,
        gestureDirection: "vertical",
      },
    },

    // SharedPost: {
    //   screen: SharedScreen,
    //   path: "post/:slug",
    //   // navigationOptions: {
    //   //   headerShown: false,
    //   // },
    // },
  },
  {
    defaultNavigationOptions: {
      headerShown: false,
      gestureEnabled: false,
      cardOverlayEnabled: true,
      ...TransitionPresets.SlideFromRightIOS,
      gestureEnabled: true,
      gestureDirection: "horizontal",
      gestureResponseDistance: 35,
    },
    mode: "modal",
    headerMode: "none",
  },
);

const App = createAppContainer(switchNavigator);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default () => {
  // const [isLoaded, setIsLoaded] = useState(false);
  const theme = useColorScheme();

  const [loaded] = useFonts({
    Montserrat: require("./src/assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("./src/assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Bold": require("./src/assets/fonts/Montserrat-Bold.ttf"),
  });

  const splash =
    theme === "dark"
      ? require("./assets/splash-dark.png")
      : require("./assets/splash-light.png");
  const bgColor = theme === "dark" ? "black" : "white";

  // console.log(bgColor);

  return (
    <AnimatedSplash
      translucent={true}
      isLoaded={loaded}
      logoImage={splash}
      backgroundColor={bgColor}
      logoHeight={150}
      logoWidth={150}
      disableBackgroundImage={true}
    >
      {loaded ? (
        <AppearanceProvider>
          <Provider>
            <App theme={theme} uriPrefix={prefix} />
          </Provider>
        </AppearanceProvider>
      ) : (
        <View style={{ backgroundColor: "#000" }} />
      )}
    </AnimatedSplash>
  );
};

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const {
      status: existingStatus,
    } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  return token;
}
