import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  ImageBackground,
  Share,
  Platform,
  InteractionManager,
  Animated,
} from "react-native";
import BlogContentLoader from "../BlogContentLoader";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { useColorScheme } from "react-native-appearance";
import getStyleSheet from "../../styles/BaseStyles";
import {
  getDefaultColor,
  categoryIdsToString,
  findPostLastCategoryId,
  calculatePostReadingTime,
  getDeviceTheme,
  hexToRgbA,
} from "../../helpers/Functions";
import { numberImageIds } from "../../helpers/Variables";

import { Context } from "../../context/BlogContext";
import PostTags from "../PostTags";
import RealatedPosts from "../RelatedPosts";
import LikeMe from "../common/LikeMe";
import { Header } from "react-native-elements";
import iframe from "@native-html/iframe-plugin";
import HTML from "react-native-render-html";
import WebView from "react-native-webview";
import { Feather } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import TimeAnimation from "../../assets/time.json";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import { IS_IPHONE_X } from "../../utils/navbar";
import { socket } from "../../utils/io";
import PlayIcon from "../../assets/images/svg/play-button.svg";
import BlogVideoItem from "../video/BlogVideoItem";
import CachedImage from "react-native-expo-cached-image";
import { singlePostProps } from "../../utils/singlePostProps";
import RenderHtml from "./RenderHtml";

const SingleBlogPostItem = (props) => {
  const { state, setState, getSinglePost } = useContext(Context);
  const navigation = props.navigation;

  const contentWidth = useWindowDimensions().width;
  const headerElementOffset = Constants.statusBarHeight + 42;
  const colorScheme = useColorScheme();
  const Styles = getStyleSheet(colorScheme);
  const isFakeLight = colorScheme === "light";
  const isLight = getDeviceTheme(colorScheme) === "light";

  //inner states
  const [isLoaded, setIsLoaded] = useState(false);
  const [singlePostData, setSinglePostData] = useState(null);
  const [htmlData, sethtmlData] = useState(null);

  //element references
  let showView = useRef();
  const timeAnimationRef = useRef();
  const likeAnimRef = useRef();

  //blogPost item
  const blogPost = props.blogPost ? props.blogPost : null;

  if (!blogPost) return null;

  // this is the html of 1-10 assay part
  const htmlContent = blogPost.content;

  const categories = state.categories;

  const liked = navigation.getParam("liked");
  const blogPostCategoryId = findPostLastCategoryId(
    blogPost.term_id,
    categories,
  );

  const { date, formattedDate, authorName, categoryNames } = singlePostProps(
    categories,
    blogPost,
  );

  //animations
  let fadeInContentOpacity = useRef(new Animated.Value(0)).current;
  let offset = new Animated.Value(0);

  const likeTranslation = offset.interpolate({
    inputRange: [240, 450],
    outputRange: [0, -42],
    extrapolate: "clamp",
  });
  const likeTranslationOpacity = offset.interpolate({
    inputRange: [240, 380],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  //calculate approximate required time to read
  const totalReadTimeInMin = calculatePostReadingTime(blogPost.content);

  useEffect(() => {
    let isSubscribed = true;
    let meIsloaded = true;

    if (isSubscribed) {
      InteractionManager.runAfterInteractions(() => {
        // setState({
        //   related_loading: true,
        // });

        setIsLoaded(false);
        (async () => {
          try {
            getPostExtraData(blogPost.id, blogPostCategoryId);
            timeAnimationRef.current.play(0, 150);
          } catch (e) {}
        })();

        if (meIsloaded) {
          setIsLoaded(true);
        }
      });
    }
    return () => {
      (meIsloaded = false), (isSubscribed = false);
    };
  }, [blogPost.id]);

  useEffect(() => {
    Animated.timing(fadeInContentOpacity, {
      duration: 1500,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [isLoaded, fadeInContentOpacity]);

  //get extra data for this post
  const getPostExtraData = async (postId, catId) => {
    try {
      // socket.connect();
      socket.emit("postTag", postId, catId, 0, function (data) {
        setSinglePostData(data);
      });
    } catch (e) {}
  };

  return (
    <>
      <ParallaxScrollView
        ref={(ref) => (showView = ref)}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        backgroundColor="black"
        contentBackgroundColor={getDefaultColor(colorScheme)}
        parallaxHeaderHeight={460}
        fadeOutForeground={true}
        backgroundScrollSpeed={1}
        stickyHeaderHeight={headerElementOffset}
        // stickyHeaderHeight={Platform.OS === "android" || IS_IPHONE_X ? 90 : 55}
        contentContainerStyle={{ paddingTop: 20 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: offset } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={1}
        renderBackground={() => (
          <View key="header-bg">
            <CachedImage
              isBackground
              source={{
                uri: blogPost.image_url,
                prefetch: blogPost.image_url,
                cache: "force-cache",
              }}
              style={styles.image}
              // fadeDuration={5000}
            >
              <View style={[styles.heroBgMask, { width: contentWidth }]}></View>
            </CachedImage>
            {/* <ImageBackground
              source={{
                uri: blogPost.image_url,
                prefetch: blogPost.image_url,
                cache: "force-cache",
              }}
              style={styles.image}
              fadeDuration={5000}
            ></ImageBackground> */}
          </View>
        )}
        renderStickyHeader={() => {
          return (
            <Header
              statusBarProps={{
                hidden: false, //Platform.OS === "android" ? false : true,
                animated: false,
                showHideTransition: "none",
                translucent: true,
                backgroundColor: "transparent",
              }}
              barStyle="light-content"
              backgroundColor="black"
              leftComponent={false}
              leftContainerStyle={{ flex: 0 }}
              centerContainerStyle={{
                flex: 7,
              }}
              centerComponent={
                <Pressable
                  onPress={() => navigation.pop()}
                  style={{
                    paddingLeft: 30,
                    alignSelf: "flex-start",
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "white",
                      fontSize: 18,
                      fontFamily: "Montserrat-SemiBold",
                    }}
                  >
                    {blogPost.title}
                  </Text>
                </Pressable>
              }
              rightContainerStyle={{
                overflow: "hidden",
                position: "relative",
              }}
              rightComponent={
                <>
                  <Pressable
                    onPress={() => {
                      onShare(blogPost);
                    }}
                    style={{
                      paddingHorizontal: 10,
                      position: "absolute",
                      zIndex: 2,
                    }}
                  >
                    {Platform.OS === "android" ? (
                      <Feather name="share-2" size={22} color="white" />
                    ) : (
                      <Feather name="share" size={22} color="white" />
                    )}
                  </Pressable>
                </>
              }
              containerStyle={{
                borderBottomWidth: 0,
                paddingVertical: 0,
                marginTop: "auto",
                marginBottom: 10,
                alignItems: "flex-end",
                height: headerElementOffset,
                zIndex: 222,
                position: "relative",
              }}
            />
          );
        }}
        renderFixedHeader={() => (
          <View key="fixed-header" style={styles.fixedSection}>
            <Pressable
              onPress={() => navigation.pop()}
              style={{ paddingRight: 10, flex: 0 }}
            >
              <Feather name="chevron-left" size={29} color="white" />
            </Pressable>
          </View>
        )}
        renderForeground={() => (
          <>
            <View style={styles.heroContainer}>
              <View style={styles.dateCategoryTimerContainer}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.dateAndCategories,
                    { color: hexToRgbA("#FFFFFF", 0.75) },
                  ]}
                >
                  {formattedDate} - {categoryNames}
                </Text>
                <LottieView
                  // key={this.props.itemId}
                  ref={timeAnimationRef}
                  autoPlay={false}
                  style={styles.timerAnimation}
                  loop={false}
                  speed={2}
                  source={TimeAnimation}
                  progress={0}
                />
                <Text
                  style={[
                    styles.timeToReadinMin,
                    { color: hexToRgbA("#FFFFFF", 0.85) },
                  ]}
                >
                  {totalReadTimeInMin}
                </Text>
              </View>
              <View>
                <Text
                  style={styles.title}
                  adjustsFontSizeToFit={true}
                  numberOfLines={3}
                  minimumFontScale={0.9}
                >
                  {blogPost.title}
                </Text>
                <Text
                  style={[
                    Styles.author,
                    {
                      paddingHorizontal: 10,
                      color: hexToRgbA("#FFFFFF", 0.85),
                    },
                  ]}
                >{`Yazar: ${authorName}`}</Text>
              </View>
            </View>
          </>
        )}
      >
        <View style={Styles.container}>
          <View>
            {isLoaded ? (
              <Animated.View
                style={{
                  opacity: fadeInContentOpacity,
                }}
              >
                <RenderHtml
                  navigation={navigation}
                  htmlContent={htmlContent}
                  contentWidth={contentWidth}
                />
              </Animated.View>
            ) : null}
          </View>
          {singlePostData !== null && (
            <>
              <PostTags tags={singlePostData.tags} />
              <RealatedPosts
                related_posts={singlePostData.posts}
                // related_loading={state.related_loading}
              />
            </>
          )}
        </View>
      </ParallaxScrollView>
      <Animated.View
        style={{
          position: "absolute",
          marginTop: 0,
          opacity: 1,
          right: 10,
          top: headerElementOffset - 36,
          height: 42,
          width: 42,
          opacity: likeTranslationOpacity,
          transform: [{ translateY: likeTranslation }],
          zIndex: 1,
        }}
      >
        <View ref={likeAnimRef}>
          <LikeMe
            key={blogPost.id}
            itemId={blogPost.id}
            item={blogPost}
            liked={liked}
            removeItem={false}
            width={42}
            height={42}
            style={{ padding: 0, marginTop: -5 }}
          />
        </View>
      </Animated.View>
    </>
  );
};
const styles = StyleSheet.create({
  viewStyle: {
    backgroundColor: "#000",
  },
  heroBgMask: {
    backgroundColor: "rgba(0,0,0,.6)",
    position: "absolute",
    top: 0,
    height: 460,
  },
  heroContainer: {
    paddingBottom: 0,
    position: "relative",
    paddingHorizontal: 0,
    marginBottom: 20,
    marginTop: "auto",
  },
  dateCategoryTimerContainer: {
    // flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    paddingHorizontal: 10,
  },
  dateAndCategories: {
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: 10,
    flex: 1,
    fontFamily: "Montserrat",
  },
  timerAnimation: {
    width: 40,
    height: 40,
    marginTop: "auto",
    marginBottom: 0,
  },
  timeToReadinMin: {
    marginLeft: "auto",
    marginTop: "auto",
    marginBottom: 10,
    fontFamily: "Montserrat-SemiBold",
  },
  image: {
    // flex: 1,
    resizeMode: "cover",
    height: 450,
    marginBottom: 20,
  },
  title: {
    color: "rgba(255,255,255,.95)",
    fontSize: 25,
    backgroundColor: "rgba(0,0,0,.1)",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontFamily: "Montserrat-SemiBold",
  },
  baseFontStyle: {
    fontSize: 19,
    lineHeight: 24,
    fontFamily: "Montserrat",
  },
  goToSlugPostText: {
    color: "#FF4F58",
    fontSize: 19,
    fontFamily: "Montserrat-SemiBold",
  },
  headingStyle: {
    textAlign: "center",
    paddingHorizontal: 10,
    marginTop: 30,
    marginBottom: 10,
    lineHeight: 35,
    fontFamily: "Montserrat-Bold",
    fontWeight: "normal",
  },
  headingFontSize: {
    fontSize: 28,
  },
  fixedSection: {
    position: "absolute",
    bottom: 6,
    left: 10,
  },
});

export default SingleBlogPostItem;
