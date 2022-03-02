import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  RefreshControl,
  Pressable,
  BackHandler,
} from "react-native";
import { useColorScheme } from "react-native-appearance";
import Storage from "../utils/storage";
import getStyleSheet from "../styles/BaseStyles";
import { Context } from "../context/BlogContext";
import { getDefaultColor, getDeviceTheme, isLiked } from "../helpers/Functions";
import { Header } from "react-native-elements";
import BlogPostItem from "../components/BlogPostItem";
import FooterIndicator from "../components/common/FooterIndicator";
import { Feather } from "@expo/vector-icons";

const InnerTagShowScreen = React.memo(
  ({ navigation, categoryPosts, pg, likes, getCategoryPostsFn, error }) => {
    const colorScheme = useColorScheme();
    const Styles = getStyleSheet(colorScheme);
    const isLight = getDeviceTheme(colorScheme) === "light";
    const categoryId = navigation.getParam("id");
    const categoryName = navigation.getParam("name");
    const categorySlug = navigation.getParam("slug");
    const categoryKey = categorySlug + categoryId;

    const currentCategoryPosts =
      typeof categoryPosts === "object" && categoryPosts[categoryKey]
        ? categoryPosts[categoryKey]
        : [];

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(0);

    useEffect(() => {
      // InteractionManager.runAfterInteractions(() => {

      let isSubscribed = true;

      if (isSubscribed) {
        if (currentCategoryPosts.length === 0) {
          getCategoryPostsFn({
            categoryId,
            categorySlug,
            page: 0,
            refresh: false,
            setLoading,
            storage: true,
          });

          if (page === 0) {
            setTimeout(() => {
              getCategoryPostsFn({
                categoryId,
                categorySlug,
                page: 0,
                refresh: false,
                setLoading,
                storage: false,
              });
            }, 50);
          }
        }
      }

      BackHandler.addEventListener("hardwareBackPress", backButtonHandler);

      return () => {
        isSubscribed = false;
        BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
      };
      // });
    }, []);

    // useEffect(() => {
    //   setTimeout(() => {
    //     // getLikes(state.likes);
    //   }, 50);
    // }, [navigation.isFocused()]);

    const backButtonHandler = () => {
      if (!navigation.isFocused()) {
        // The screen is not focused, so don't do anything
        return false;
      }
      return navigation.navigate("Category");
    };

    const onRefresh = () => {
      // const totalPage = state[`${categoryKey}_totalPage`];

      // setState({
      //   refreshing: true,
      //   loadingMore: false,
      //   [`${categoryKey}_page`]: 0,
      //   // [`${categoryKey}_totalPage`]: totalPage,
      //   error: false,
      // });

      setPage(0);
      setRefreshing(true);

      getCategoryPostsFn({
        categoryId,
        categorySlug,
        page: 0,
        setLoading,
        setRefreshing,
        refresh: true,
      });
    };

    const handleLoadMore = function () {
      if (loading) return null;

      const pg = page;
      // const totalPage = state[`${categoryKey}_totalPage`];
      // if (!categoryPosts.length && pg == totalPage) return null;

      setLoading(true);
      setPage(pg + 10);

      // console.log("page", page);

      // if (pg + 1 > 0) {
      //   setState({
      //     [`${categoryKey}_page`]: pg + 10,
      //     // [`${categoryKey}_totalPage`]: totalPage,
      //     loadingMore: true,
      //     refreshing: false,
      //     error: false,
      //   });

      getCategoryPostsFn({
        categoryId,
        categorySlug,
        page: pg + 10,
        // totalPage,
        setLoading,
      });
      // } else return;
    };

    return (
      <View style={Styles.container}>
        <Header
          barStyle={isLight ? "dark-content" : "light-content"}
          backgroundColor={getDefaultColor(colorScheme, false)}
          leftComponent={
            <Pressable
              onPress={() => navigation.popToTop()}
              style={{ height: 32, paddingRight: 10 }}
            >
              <Feather
                name="chevron-left"
                size={32}
                color={isLight ? "black" : "white"}
              />
            </Pressable>
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
                {categoryName}
              </Text>
            </View>
          }
          containerStyle={{
            borderBottomColor: isLight
              ? "rgba(0,0,0,.15)"
              : "rgba(255,255,255,.15)",
            paddingVertical: 5,
          }}
        ></Header>
        <View style={{ flex: 1 }}>
          {error ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
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
            <>
              <FlatList
                key={`category-posts-${categoryId}`}
                data={currentCategoryPosts}
                onEndReached={() => handleLoadMore()}
                onEndReachedThreshold={0.02}
                ListFooterComponent={
                  <FooterIndicator loadingMore={loading} error={error} />
                }
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    title="Lütfen bekleyiniz..."
                    tintColor={isLight ? "black" : "white"}
                    titleColor={isLight ? "black" : "white"}
                  />
                }
                showsVerticalScrollIndicator={false}
                keyExtractor={(blogPost) =>
                  `cat_${categoryId}_${blogPost.id.toString()}`
                }
                renderItem={({ item }) => {
                  return (
                    <BlogPostItem liked={isLiked(likes, item.id)} item={item} />
                  );
                }}
              />
            </>
          )}
        </View>
      </View>
    );
  },
);

const TagShowScreen = React.memo(({ navigation }) => {
  const { state, getCategoryPosts } = useContext(Context);

  const { categoryPosts, likes } = state;

  const getCategoryPostsFn = getCategoryPosts;

  return (
    <InnerTagShowScreen
      navigation={navigation}
      categoryPosts={categoryPosts}
      likes={likes}
      getCategoryPostsFn={getCategoryPostsFn}
      error={false}
    />
  );
});

export default TagShowScreen;
