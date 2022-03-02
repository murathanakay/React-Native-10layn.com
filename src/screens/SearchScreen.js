import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  ImageBackground,
  RefreshControl,
} from "react-native";

import { useColorScheme } from "react-native-appearance";

import getStyleSheet from "../styles/BaseStyles";
import { getDefaultColor, isLightTheme, isLiked } from "../helpers/Functions";
import { Context } from "../context/BlogContext";
import { Header } from "react-native-elements";
import Moment from "moment";
require("moment/locale/tr.js");
Moment.locale("tr");
import { Logo } from "../components/common/svg/Logo";
import FooterIndicator from "../components/common/FooterIndicator";
import BlogPostItem from "../components/BlogPostItem";
import SearchBar from "../components/SearchBar";
import AnimatedEllipsis from "react-native-three-dots-loader";

const SearchScreen = ({ navigation }) => {
  const { state, setState, getSearchPosts } = useContext(Context);
  const colorScheme = useColorScheme();
  const Styles = getStyleSheet(colorScheme);
  const isLight = isLightTheme(colorScheme);
  const query = navigation.getParam("query");

  const searchPosts = state.searchPosts;
  //state.searchPosts.length > 0 ? state.searchPosts : state.posts;

  /**
   * @todo
   * show results on press GO!!!!
   *
   */

  console.log("SearchScreen");

  useEffect(() => {
    // getBlogPosts(1);

    const listener = navigation.addListener("didFocus", () => {
      // getLikes();
      // getBlogPosts(state.page ? state.page : 1);
      // console.log(state.likes);

      console.log("searchShowEmptyMessage", state.searchShowEmptyMessage);
    });

    return () => {
      listener.remove();
    };
  }, []);

  // console.log(navigation, theme);

  const onRefresh = () => {
    setState({
      refreshing: true,
      loadingMore: false,
      searchPage: 1,
      error: false,
    });

    getSearchPosts(0, state.query);
  };

  const handleLoadMore = () => {
    if (state.searchStopLoading) return;
    if (state.loadingMore) return;

    const pg = state.searchPage;

    setState({
      searchPage: pg + 10,
      loadingMore: true,
      refreshing: false,
      error: false,
    });

    getSearchPosts(pg + 10, state.query);
  };

  const refreshing = !state.error ? state.refreshing : false;

  // console.log(Styles);

  return (
    <View style={Styles.container2}>
      <Header
        statusBarProps={{
          barStyle: isLight ? "dark-content" : "light-content",
        }}
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
      <View style={{ flex: 1 }}>
        <SearchBar
          navigation={navigation}
          onCancel={() => navigation.navigate("Index")}
          query={query}
          page={state.searchPage}
          theme={colorScheme}
        />

        {state && state.error ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ color: "white", fontSize: 18, marginBottom: 15 }}>
              Ufak bir sorunla karşılaşıldı.
            </Text>
            <Button
              title="Tekrar yüklemek için dokunun"
              onPress={() => {
                onRefresh();
              }}
            />
          </View>
        ) : (
          <FlatList
            data={searchPosts}
            onEndReached={() => handleLoadMore()}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              <FooterIndicator
                loadingMore={state.loadingMore}
                error={state.error}
                isLight={isLight}
              />
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                title="Lütfen bekleyiniz..."
                tintColor={getDefaultColor(colorScheme, true)}
                titleColor={getDefaultColor(colorScheme, true)}
              />
            }
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={{ marginTop: 15, paddingHorizontal: 10 }}>
                <View style={Styles.searchMessageArrow}></View>
                <View style={Styles.searchMessageContainer}>
                  {state.searchShowMessage ? (
                    <Text
                      style={{
                        color: isLight
                          ? "rgba(0,0,0,.5)"
                          : "rgba(255,255,255,.4)",
                        fontSize: 18,
                      }}
                    >
                      Arama yapmak için yazmaya başlayın...
                    </Text>
                  ) : state.searchLoading ? (
                    <Text
                      style={{
                        color: isLight
                          ? "rgba(0,0,0,.5)"
                          : "rgba(255,255,255,.4)",
                        fontSize: 18,
                      }}
                    >
                      Aranıyor
                      <AnimatedEllipsis size={3} />
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: isLight
                          ? "rgba(0,0,0,.5)"
                          : "rgba(255,255,255,.4)",
                        fontSize: 18,
                      }}
                    >
                      {`'${state.query}' için bir sonuç bulunamadı.`}
                    </Text>
                  )}
                </View>
              </View>
            }
            keyExtractor={(blogPost) => `q-${blogPost.id.toString()}`}
            renderItem={({ item }) => {
              return (
                <BlogPostItem
                  liked={isLiked(state.likes, item.id)}
                  item={item}
                  sourceKey="searchPosts"
                />
              );
            }}
          />
        )}
      </View>
    </View>
  );
};

export default SearchScreen;
