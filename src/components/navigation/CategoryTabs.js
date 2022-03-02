import React from "react";
import { Text, Platform } from "react-native";
import { useColorScheme, Appearance } from "react-native-appearance";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBar as RNMaterialTopTabBar,
} from "react-navigation-tabs";
import CategoryPostsScreen from "../../screens/CategoryPostsScreen";
import { catImages } from "../../assets/images/svg/categories/catImages";
import { getDefaultColor, getDeviceTheme } from "../../helpers/Functions";
import { IS_IPHONE_X } from "../../utils/navbar";

const CategoryTabColors = {
  inactiveTintColor: {
    dark: "#444",
    light: "#999",
  },
  activeTintColor: {
    dark: Platform.OS === "android" ? "#818181" : "#FFFFFF",
    light: "black",
  },

  navBarBgColor: {
    dark: "#000",
    light: "#FFFFFF",
  },
};

const MaterialTopTabBar = (props) => {
  const colorScheme = useColorScheme();

  return (
    <RNMaterialTopTabBar
      {...props}
      activeTintColor={props.activeTintColor}
      inactiveTintColor={props.inactiveTintColor}
      // indicatorStyle={styles.indicatorStyle}
      style={{
        ...props.style,
        backgroundColor: getDefaultColor(colorScheme, false),
      }}
    />
  );
};

const CategoryTabs = createMaterialTopTabNavigator(
  {
    "bilim-teknoloji": {
      screen: CategoryPostsScreen,
      navigationOptions: ({ theme }) => {
        const deviceTheme = getDeviceTheme(theme);

        return {
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={{
                  color: focused
                    ? CategoryTabColors.activeTintColor[deviceTheme]
                    : CategoryTabColors.inactiveTintColor[deviceTheme],
                }}
              >
                BİLİM TEKNOLOJİ
              </Text>
            );
          },
          // tabBarVisible: false,
          tabBarIcon: ({ focused, tintColor }) => {
            const Icon = catImages["bilim-teknoloji"];

            return (
              <Icon
                style={{
                  fill: focused
                    ? CategoryTabColors.activeTintColor[deviceTheme]
                    : CategoryTabColors.inactiveTintColor[deviceTheme],
                }}
              />
            );
          },
        };
      },
      params: {
        id: 3,
        name: `Bilim Teknoloji`,
        slug: `bilim-teknoloji`,
      },
    },

    dunya: {
      screen: CategoryPostsScreen,
      navigationOptions: ({ theme }) => {
        const deviceTheme = getDeviceTheme(theme);

        return {
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={{
                  color: focused
                    ? CategoryTabColors.activeTintColor[deviceTheme]
                    : CategoryTabColors.inactiveTintColor[deviceTheme],
                }}
              >
                DÜNYA
              </Text>
            );
          },
          // tabBarVisible: false,
          tabBarIcon: ({ focused }) => {
            const Icon = catImages["dunya"];

            return (
              <Icon
                style={{
                  fill: focused
                    ? CategoryTabColors.activeTintColor[deviceTheme]
                    : CategoryTabColors.inactiveTintColor[deviceTheme],
                }}
              />
            );
          },
        };
      },
      params: { id: 4, name: `Dünya`, slug: `dunya` },
    },
    "kultur-sanat": {
      screen: CategoryPostsScreen,
      navigationOptions: ({ theme }) => {
        const deviceTheme = getDeviceTheme(theme);

        return {
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={{
                  color: focused
                    ? CategoryTabColors.activeTintColor[deviceTheme]
                    : CategoryTabColors.inactiveTintColor[deviceTheme],
                }}
              >
                KÜLTÜR SANAT
              </Text>
            );
          },
          // tabBarVisible: false,
          tabBarIcon: ({ focused }) => {
            const Icon = catImages["kultur-sanat"];

            return (
              <Icon
                style={{
                  fill: focused
                    ? CategoryTabColors.activeTintColor[deviceTheme]
                    : CategoryTabColors.inactiveTintColor[deviceTheme],
                }}
              />
            );
          },
        };
      },
      params: {
        id: 5,
        name: `Kültür Sanat`,
        slug: `kultur-sanat`,
      },
    },
    seyahat: {
      screen: CategoryPostsScreen,
      navigationOptions: ({ theme }) => {
        const deviceTheme = getDeviceTheme(theme);

        return {
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={{
                  color: focused
                    ? CategoryTabColors.activeTintColor[deviceTheme]
                    : CategoryTabColors.inactiveTintColor[deviceTheme],
                }}
              >
                SEYAHAT
              </Text>
            );
          },
          // tabBarVisible: false,
          tabBarIcon: ({ focused }) => {
            const Icon = catImages["seyahat"];

            return (
              <Icon
                style={{
                  fill: focused
                    ? CategoryTabColors.activeTintColor[deviceTheme]
                    : CategoryTabColors.inactiveTintColor[deviceTheme],
                }}
              />
            );
          },
        };
      },
      params: {
        id: 6,
        name: `Seyahat`,
        slug: `seyahat`,
      },
    },
    spor: {
      screen: CategoryPostsScreen,
      path: "category/:category",
      navigationOptions: ({ theme }) => {
        const deviceTheme = getDeviceTheme(theme);

        return {
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={{
                  color: focused
                    ? CategoryTabColors.activeTintColor[deviceTheme]
                    : CategoryTabColors.inactiveTintColor[deviceTheme],
                }}
              >
                SPOR
              </Text>
            );
          },
          // tabBarVisible: false,
          tabBarIcon: ({ focused }) => {
            const Icon = catImages["spor"];

            return (
              <Icon
                style={{
                  fill: focused
                    ? CategoryTabColors.activeTintColor[deviceTheme]
                    : CategoryTabColors.inactiveTintColor[deviceTheme],
                }}
              />
            );
          },
        };
      },
      params: {
        id: 7,
        name: `Spor`,
        slug: `spor`,
      },
    },
    yasam: {
      screen: CategoryPostsScreen,
      navigationOptions: ({ theme }) => {
        const deviceTheme = getDeviceTheme(theme);

        return {
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={{
                  color: focused
                    ? CategoryTabColors.activeTintColor[deviceTheme]
                    : CategoryTabColors.inactiveTintColor[deviceTheme],
                }}
              >
                YAŞAM
              </Text>
            );
          },
          // tabBarVisible: false,
          tabBarIcon: ({ focused }) => {
            const Icon = catImages["yasam"];

            return (
              <Icon
                style={{
                  fill: focused
                    ? CategoryTabColors.activeTintColor[deviceTheme]
                    : CategoryTabColors.inactiveTintColor[deviceTheme],
                }}
              />
            );
          },
        };
      },
      params: {
        id: 8,
        name: `Yaşam`,
        slug: `yasam`,
      },
    },
    yemek: {
      screen: CategoryPostsScreen,
      navigationOptions: ({ theme }) => {
        const deviceTheme = getDeviceTheme(theme);

        return {
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={{
                  color: focused
                    ? CategoryTabColors.activeTintColor[deviceTheme]
                    : CategoryTabColors.inactiveTintColor[deviceTheme],
                }}
              >
                YEMEK
              </Text>
            );
          },
          tabBarIcon: ({ tintColor, focused }) => {
            const Icon = catImages["yemek"];

            return (
              <Icon
                style={{
                  fill: focused
                    ? CategoryTabColors.activeTintColor[deviceTheme]
                    : CategoryTabColors.inactiveTintColor[deviceTheme],
                }}
              />
            );
          },
          // tabBarOnPress: (obj) => obj.navigation.navigate("yemek"),
        };
      },
      params: {
        id: 9,
        name: `Yemek`,
        slug: `yemek`,
      },
    },
    tarih: {
      screen: CategoryPostsScreen,
      navigationOptions: ({ theme }) => {
        const deviceTheme = getDeviceTheme(theme);

        return {
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={{
                  color: focused
                    ? CategoryTabColors.activeTintColor[deviceTheme]
                    : CategoryTabColors.inactiveTintColor[deviceTheme],
                }}
              >
                TARİH
              </Text>
            );
          },
          // tabBarVisible: false,
          tabBarIcon: ({ focused }) => {
            const Icon = catImages["tarih"];

            return (
              <Icon
                style={{
                  fill: focused
                    ? CategoryTabColors.activeTintColor[deviceTheme]
                    : CategoryTabColors.inactiveTintColor[deviceTheme],
                }}
              />
            );
          },
        };
      },
      params: {
        id: 1930,
        name: `Tarih`,
        slug: `tarih`,
      },
    },
  },
  {
    tabBarComponent: MaterialTopTabBar,
    swipeEnabled: true,
    // navigationOptions: {
    //   // mode: "card",
    // },
    defaultNavigationOptions: {
      swipeEnabled: true,
    },
    tabBarPosition: "bottom",
    lazy: true,

    tabBarOptions: {
      bounces: true,
      pressOpacity: 1,
      scrollEnabled: true,
      allowFontScaling: true,
      upperCaseLabel: false,
      showIcon: true,
      showLabel: true,
      style: {
        paddingBottom: 0,
      },
      indicatorStyle: {
        // flex: 0,
        backgroundColor: "rgba(51,51,51,.3)",
        // height: 0,
        // top: 0,
      },
    },
  },
);

export default CategoryTabs;
