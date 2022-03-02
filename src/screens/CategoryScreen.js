import React, { useContext, memo } from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
// import { withNavigation } from "react-navigation";
import { useColorScheme } from "react-native-appearance";
import {
  getDefaultColor,
  getZeroParentCategories,
  isLightTheme,
} from "../helpers/Functions";
import getStyleSheet from "../styles/BaseStyles";
import { Header } from "react-native-elements";
import { Logo } from "../components/common/svg/Logo";
import { catImages } from "../assets/images/svg/categories/catImages";
import { IS_IPHONE_X } from "../utils/navbar";
import { Context } from "../context/BlogContext";

const InnerCategoryScreen = React.memo(({ navigation, allCategories }) => {
  const colorScheme = useColorScheme();
  const Styles = getStyleSheet(colorScheme);
  const isLight = isLightTheme(colorScheme);

  console.log("CategoryScreen");

  const categories = getZeroParentCategories(allCategories || []),
    categoryItems = [];

  categories.forEach((value, index) => {
    const categoryRoute = value.slug.replace(" ", "");
    const borderLeft =
      index % 2 === 1
        ? {
            borderLeftWidth: 1,
            borderLeftColor: isLight
              ? "rgba(0,0,0,.1)"
              : "rgba(255,255,255,.1)",
          }
        : {};

    const borderBottom =
      index < 6
        ? {
            borderBottomWidth: 1,
            borderBottomColor: isLight
              ? "rgba(0,0,0,.1)"
              : "rgba(255,255,255,.1)",
          }
        : {};

    const Icon = catImages[value.slug];

    categoryItems.push(
      <Pressable
        onPress={() => {
          console.log("pressed");
          navigation.navigate(categoryRoute);
        }}
        activeOpacity={0.9}
        key={index}
        style={[styles.categoryItem, borderLeft, borderBottom]}
      >
        <View style={styles.categoryIconContainer}>
          <Icon
            style={[
              styles.categoryIcon,
              {
                fill: isLight
                  ? "#000"
                  : Platform.OS === "android"
                  ? "#818181"
                  : "#FFFFFF",
              },
            ]}
          />
        </View>
        <View>
          <Text style={Styles.categoryName}>{value.name}</Text>
        </View>
      </Pressable>,
    );
  });

  return (
    <View style={[Styles.container, { paddingBottom: 0 }]}>
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
      />
      <View
        style={[
          styles.categoryContainer,
          { marginBottom: IS_IPHONE_X ? 74 : 54 },
        ]}
      >
        {categoryItems}
      </View>
    </View>
  );
});

const CategoryScreen = ({ navigation }) => {
  const { state } = useContext(Context);
  return (
    <InnerCategoryScreen
      allCategories={state.categories}
      navigation={navigation}
    />
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#000",
    flex: 1,
  },
  categoryContainer: {
    flex: 1,
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "stretch",
    alignItems: "stretch",
    width: "100%",
  },
  categoryItem: {
    width: "50%",
    alignContent: "center",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    paddingVertical: 10,
  },
  categoryIconContainer: {
    fontSize: 50,
    alignContent: "center",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    color: "#ddd",
  },
});

export default CategoryScreen;
