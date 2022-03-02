import React, { useState } from "react";
import { Text } from "react-native";
import { Provider } from "./src/context/BlogContext";
import { AppearanceProvider, useColorScheme } from "react-native-appearance";

import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
} from "react-navigation-tabs";

import IndexScreen from "./src/screens/IndexScreen";
import CategoryScreen from "./src/screens/CategoryScreen";
import FavoriteScreen from "./src/screens/FavoriteScreen";
import SettingScreen from "./src/screens/SettingScreen";
import ShowScreen from "./src/screens/ShowScreen";
import ShareShowScreen from "./src/screens/ShareShowScreen";

import { Feather } from "@expo/vector-icons";
import CategoryPostsScreen from "./src/screens/CategoryPostsScreen";
// import CategoryPostsScreen2 from "./src/screens/CategoryPostsScreen2";

import LottieView from "lottie-react-native";
import FavoriteIcon from "./src/assets/favorites.json";

import { catImages } from "./src/assets/images/svg/categories/catImages";
import { TabBar } from "./src/components/navigation/TabBar";

const CategoryTabColors = {
  inactiveTintColor: {
    dark: "#444",
    light: "#999",
  },
  activeTintColor: {
    dark: "white",
    light: "black",
  },
};

const CategoryStack = createStackNavigator(
  {
    Category: {
      screen: CategoryScreen,
    },
  },
  {
    defaultNavigationOptions: {
      headerShown: false,
      backBehavior: "history",
    },
  },
);

const switchNavigator = createStackNavigator(
  {
    mainFlow: createBottomTabNavigator(
      {
        Index: {
          screen: IndexScreen,
          navigationOptions: {
            tabBarLabel: "",
            tabBarIcon: ({ tintColor }) => {
              return <Feather name="home" size={24} color={tintColor} />;
            },
            headerShown: false,
            tabBarOnPress: (obj) => obj.navigation.navigate("Index"),
          },
        },
        // Category: {
        //   screen: CategoryStack,
        //   navigationOptions: {
        //     tabBarLabel: "",
        //     tabBarIcon: ({ tintColor }) => {
        //       return <Feather name="layers" size={24} color={tintColor} />;
        //     },
        //     tabBarOnPress: (obj) => obj.navigation.navigate("Category"),
        //   },
        // },
        CategoryItems: createMaterialTopTabNavigator(
          {
            "bilim-teknoloji": {
              screen: CategoryPostsScreen,
              navigationOptions: ({ theme }) => {
                return {
                  tabBarLabel: ({ focused }) => {
                    return (
                      <Text
                        style={{
                          color: focused
                            ? CategoryTabColors.activeTintColor[theme]
                            : CategoryTabColors.inactiveTintColor[theme],
                        }}
                      >
                        BİLİM TEKNOLOJİ
                      </Text>
                    );
                  },
                  // tabBarVisible: false,
                  tabBarIcon: ({ focused }) => {
                    const Icon = catImages["bilim-teknoloji"];

                    return (
                      <Icon
                        style={{
                          fill: focused
                            ? CategoryTabColors.activeTintColor[theme]
                            : CategoryTabColors.inactiveTintColor[theme],
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
              backBehavior: "history",
            },

            dunya: {
              screen: CategoryPostsScreen,
              navigationOptions: ({ theme }) => {
                return {
                  tabBarLabel: ({ focused }) => {
                    return (
                      <Text
                        style={{
                          color: focused
                            ? CategoryTabColors.activeTintColor[theme]
                            : CategoryTabColors.inactiveTintColor[theme],
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
                            ? CategoryTabColors.activeTintColor[theme]
                            : CategoryTabColors.inactiveTintColor[theme],
                        }}
                      />
                    );
                  },
                };
              },
              params: { id: 4, name: `Dünya`, slug: `dunya` },
              backBehavior: "history",
            },
            "kultur-sanat": {
              screen: CategoryPostsScreen,
              navigationOptions: ({ theme }) => {
                return {
                  tabBarLabel: ({ focused }) => {
                    return (
                      <Text
                        style={{
                          color: focused
                            ? CategoryTabColors.activeTintColor[theme]
                            : CategoryTabColors.inactiveTintColor[theme],
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
                            ? CategoryTabColors.activeTintColor[theme]
                            : CategoryTabColors.inactiveTintColor[theme],
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
              backBehavior: "history",
            },
            seyahat: {
              screen: CategoryPostsScreen,
              navigationOptions: ({ theme }) => {
                return {
                  tabBarLabel: ({ focused }) => {
                    return (
                      <Text
                        style={{
                          color: focused
                            ? CategoryTabColors.activeTintColor[theme]
                            : CategoryTabColors.inactiveTintColor[theme],
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
                            ? CategoryTabColors.activeTintColor[theme]
                            : CategoryTabColors.inactiveTintColor[theme],
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
              backBehavior: "history",
            },
            spor: {
              screen: CategoryPostsScreen,
              path: "category/:category",
              navigationOptions: ({ theme }) => {
                return {
                  tabBarLabel: ({ focused }) => {
                    return (
                      <Text
                        style={{
                          color: focused
                            ? CategoryTabColors.activeTintColor[theme]
                            : CategoryTabColors.inactiveTintColor[theme],
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
                            ? CategoryTabColors.activeTintColor[theme]
                            : CategoryTabColors.inactiveTintColor[theme],
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
              backBehavior: "history",
            },
            tarih: {
              screen: CategoryPostsScreen,
              navigationOptions: ({ theme }) => {
                return {
                  tabBarLabel: ({ focused }) => {
                    return (
                      <Text
                        style={{
                          color: focused
                            ? CategoryTabColors.activeTintColor[theme]
                            : CategoryTabColors.inactiveTintColor[theme],
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
                            ? CategoryTabColors.activeTintColor[theme]
                            : CategoryTabColors.inactiveTintColor[theme],
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
              backBehavior: "history",
            },
            yasam: {
              screen: CategoryPostsScreen,
              navigationOptions: ({ theme }) => {
                return {
                  tabBarLabel: ({ focused }) => {
                    return (
                      <Text
                        style={{
                          color: focused
                            ? CategoryTabColors.activeTintColor[theme]
                            : CategoryTabColors.inactiveTintColor[theme],
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
                            ? CategoryTabColors.activeTintColor[theme]
                            : CategoryTabColors.inactiveTintColor[theme],
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
              backBehavior: "history",
            },
            yemek: {
              screen: CategoryPostsScreen,
              navigationOptions: ({ theme }) => {
                return {
                  tabBarLabel: ({ focused }) => {
                    return (
                      <Text
                        style={{
                          color: focused
                            ? CategoryTabColors.activeTintColor[theme]
                            : CategoryTabColors.inactiveTintColor[theme],
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
                            ? CategoryTabColors.activeTintColor[theme]
                            : CategoryTabColors.inactiveTintColor[theme],
                        }}
                      />
                    );
                  },
                };
              },
              params: {
                id: 9,
                name: `Yemek`,
                slug: `yemek`,
              },
              backBehavior: "history",
            },
          },
          {
            // tabBarComponent: CategoryMTN,
            navigationOptions: {
              lazy: false,
              swipeEnabled: true,
              headerShown: false,
              tabBarVisible: false,
              tabBarButtonComponent: (routeName, onPress) => {
                return null;
              },
            },
            tabBarPosition: "bottom",
            tabBarOptions: {
              pressOpacity: 1,
              scrollEnabled: true,
              upperCaseLabel: false,
              showIcon: true,
              showLabel: true,
              // activeTintColor: {
              //   dark: "rgba(255,255,255,1)",
              //   light: "rgba(0,0,0,0.95)",
              // },
              // inactiveTintColor: {
              //   dark: "rgba(255,255,255,0.5)",
              //   light: "rgba(0,0,0,0.45)",
              // },
              style: {
                backgroundColor: {
                  dark: "#000",
                  light: "#fff",
                },
                paddingBottom: 10,
                borderTopColor: {
                  dark: "rgba(255,255,255,.15)",
                  light: "rgba(0,0,0,0.01)",
                },
                borderTopWidth: 1,
              },
              indicatorStyle: {
                flex: 0,
                backgroundColor: "transparent",
                height: 0,
                top: 0,
              },
            },
          },
        ),

        // SearchButton: {
        //   screen: IndexScreen,
        //   navigationOptions: {
        //     tabBarLabel: "",
        //     tabBarIcon: ({ tintColor }) => {
        //       return <Feather name="search" size={24} color={tintColor} />;
        //     },
        //     tabBarOnPress: (obj) => obj.navigation.navigate("Index"),
        //   },
        // },

        // Favorite: {
        //   screen: FavoriteScreen,
        //   navigationOptions: {
        //     tabBarLabel: "",
        //     tabBarIcon: ({ tintColor, focused }) => {
        //       // return <Feather name="star" size={24} color={tintColor} />;

        //       return focused ? (
        //         <Feather name="heart" size={24} color={tintColor} />
        //       ) : (
        //         <LottieView
        //           ref={(animation) => {
        //             global.heartAnimation = animation;
        //           }}
        //           style={{
        //             width: 56,
        //             height: 56,
        //           }}
        //           loop={false}
        //           speed={1.5}
        //           source={FavoriteIcon}
        //           progress={0}
        //           // OR find more Lottie files @ https://lottiefiles.com/featured
        //           // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
        //         />
        //       );
        //     },
        //     tabBarOnPress: (obj) => obj.navigation.navigate("Favorite"),
        //   },
        // },

        // Setting: {
        //   screen: SettingScreen,
        //   navigationOptions: {
        //     tabBarLabel: "",
        //     tabBarIcon: ({ tintColor }) => {
        //       return <Feather name="settings" size={24} color={tintColor} />;
        //     },
        //     tabBarOnPress: (obj) => obj.navigation.navigate("Setting"),
        //   },
        // },
      },
      {
        tabBarComponent: TabBar,
        tabBarPosition: "bottom",
        backBehavior: "history",
        lazy: false,
        tabBarOptions: {
          backBehavior: "history",
          showIcon: true,
          showLabel: false,
          style: {
            backgroundColor: {
              dark: "red",
              light: "#fff",
            },
            borderTopWidth: 1,
            borderTopColor: "rgba(0,0,0,.1)",
            // paddingBottom: 0,
          },
          // allowFontScaling: true,
          iconStyle: {},
          activeTintColor: "red",
          inactiveTintColor: "rgba(0, 0, 0, 0.45)",
        },
      },
    ),
    showFlow: createStackNavigator({
      Show: {
        screen: ShowScreen,
        navigationOptions: {
          // style: {
          //   backgroundColor: "#000",
          // },
          headerMode: "float",
          headerShown: false,
        },
      },
      //show shared post deep linking
      //redirected from our 10layn.com server with ie: <script>window.location.replace("10layn://post/ID_OF_THE_POST");</script>
      ShareShow: {
        screen: ShareShowScreen,
        path: "/post/:id",
        navigationOptions: {
          style: {
            backgroundColor: "#000",
          },
          headerMode: "float",
          headerShown: false,
        },
      },
    }),
  },
  {
    defaultNavigationOptions: {
      headerShown: false,
    },
    mode: "modal",
    headerMode: "none",
  },
);

export default () => {
  let theme = useColorScheme();
  const App = createAppContainer(switchNavigator);

  return (
    <AppearanceProvider>
      <Provider>
        <App theme={theme} />
      </Provider>
    </AppearanceProvider>
  );
};
