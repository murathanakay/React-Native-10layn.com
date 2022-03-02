import React, { useContext, useEffect, memo } from "react";
import { View, Text, FlatList } from "react-native";
import { useColorScheme } from "react-native-appearance";
import getStyleSheet from "../styles/BaseStyles";
import { Context } from "../context/BlogContext";
import BlogPostItem from "../components/BlogPostItem";
import { Header } from "react-native-elements";
import Moment from "moment";
require("moment/locale/tr.js");
Moment.locale("tr");
import { Logo } from "../components/common/svg/Logo";
import { getDefaultColor, isLightTheme, isLiked } from "../helpers/Functions";

const InnerFavoriteScreen = React.memo(({ likes }) => {
  const colorScheme = useColorScheme();
  const Styles = getStyleSheet(colorScheme);
  const isLight = isLightTheme(colorScheme);
  console.log("InnerFavoriteScreen");

  return (
    <View style={Styles.container2}>
      <Header
        statusBarProps={{
          barStyle: isLight ? "dark-content" : "light-content",
        }}
        backgroundColor={getDefaultColor(colorScheme)}
        leftComponent={
          <View style={{ height: 32 }}>
            <Logo width={32} height={32} isLight={isLight} />
          </View>
        }
        centerComponent={
          <View style={{ height: 32, alignItems: "flex-end" }}>
            <Text
              style={{
                fontSize: 24,
                color: isLight ? "black" : "white",
                fontWeight: "500",
                alignSelf: "flex-end",
              }}
            >
              Favorilerim
            </Text>
          </View>
        }
        containerStyle={{
          borderBottomColor: isLight
            ? "rgba(0,0,0,.15)"
            : "rgba(255,255,255,.15)",
          paddingVertical: 5,
        }}
      />
      <View style={{ flex: 1 }}>
        <FlatList
          data={likes}
          showsVerticalScrollIndicator={false}
          keyExtractor={(blogPost) => `fav_${blogPost.id.toString()}`}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <View
              // style={{
              //   flex: 1,
              // }}
              >
                <Text
                  style={{
                    color: isLight ? "black" : "white",
                    fontSize: 20,
                  }}
                >
                  Favori listeniz henüz boş
                </Text>
              </View>
            </View>
          }
          renderItem={({ item }) => {
            return (
              <BlogPostItem
                liked={isLiked(likes, item.id)}
                item={item}
                {...{ storedItem: item, removeItem: true }}
              />
            );
          }}
        />
      </View>
    </View>
  );
});

const FavoriteScreen = () => {
  const { state } = useContext(Context);

  const likes = state.likes;

  return <InnerFavoriteScreen likes={likes} />;
};

export default memo(FavoriteScreen);
