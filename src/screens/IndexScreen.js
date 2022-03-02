import React, { memo, useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  RefreshControl,
  InteractionManager,
} from "react-native";
import { useColorScheme } from "react-native-appearance";
import getStyleSheet from "../styles/BaseStyles";
import {
  getDefaultColor,
  getDeviceTheme,
  isLightTheme,
  isLiked,
} from "../helpers/Functions";
import { Context } from "../context/BlogContext";
import BlogPostItem from "../components/BlogPostItem";
import { Header } from "react-native-elements";
import { Logo } from "../components/common/svg/Logo";
import FooterIndicator from "../components/common/FooterIndicator";

const InnerIndexScreen = React.memo(
  ({ navigation, pg, posts, likes, getBlogPostsFn, error }) => {
    const colorScheme = useColorScheme();
    const Styles = getStyleSheet(colorScheme);
    const isLight = isLightTheme(colorScheme);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(pg);

    const listRef = useRef(null);

    console.log("InnerIndexScreen", pg);

    useEffect(() => {
      navigation.setParams({
        scrollTopMe: () => {
          listRef.current.scrollToOffset(1);
        },
      });
    }, []);

    useEffect(() => {
      InteractionManager.runAfterInteractions(() => {
        let isSubscribed = true;

        if (isSubscribed) {
          getBlogPostsFn({
            page,
            setLoading,
            refresh: false,
            fetch: false,
          });

          if (page === 0) {
            setTimeout(() => {
              getBlogPostsFn({
                page,
                setLoading,
                refresh: false,
                fetch: true,
              });
            }, 500);
          }
        }

        return () => {
          isSubscribed = false;
        };
      });
    }, []);

    const onRefresh = () => {
      if (refreshing) return null;
      setPage(0);
      setRefreshing(true);

      getBlogPostsFn({
        page: 0,
        refresh: true,
        fetch: true,
        setLoading,
        setRefreshing,
      });
    };

    const handleLoadMore = () => {
      if (loading) return;

      const pg = page;

      setLoading(true);
      setPage(pg + 10);

      getBlogPostsFn({
        page: pg + 10,
        setLoading,
      });
    };

    // const refreshing = !state.error ? state.refreshing : false;
    return (
      <View style={Styles.container}>
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
            <FlatList
              style={{ flex: 1 }}
              ref={listRef}
              key="index-posts"
              data={posts}
              onEndReached={() => handleLoadMore()}
              onEndReachedThreshold={0.9}
              initialNumToRender={10}
              ListFooterComponent={
                <FooterIndicator loadingMore={loading} error={error} />
              }
              ListFooterComponentStyle={page > 0 ? { flex: 0 } : { flex: 1 }}
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
              keyExtractor={(blogPost) => blogPost.id.toString()}
              renderItem={({ item }) => {
                return (
                  <BlogPostItem liked={isLiked(likes, item.id)} item={item} />
                );
              }}
            />
          )}
        </View>
      </View>
    );
  },
);

const IndexScreen = ({ navigation }) => {
  // const navigation = props.navigation;
  const { state, getBlogPosts } = useContext(Context);
  const { posts, page, likes } = state;
  const getBlogPostsFn = getBlogPosts;

  console.log("page", page);

  return (
    <InnerIndexScreen
      navigation={navigation}
      posts={posts}
      pg={page}
      likes={likes}
      getBlogPostsFn={getBlogPostsFn}
      error={false}
    />
  );
};

export default IndexScreen;
