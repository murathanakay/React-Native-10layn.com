import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  useWindowDimensions,
  ImageBackground,
  Share,
  SafeAreaView,
  Platform,
  InteractionManager,
  Animated,
  ActivityIndicator,
} from "react-native";
import BlogContentLoader from "../components/BlogContentLoader";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { useColorScheme } from "react-native-appearance";
import getStyleSheet from "../styles/BaseStyles";
import {
  getDefaultColor,
  categoryIdsToString,
  findPostLastCategoryId,
  calculatePostReadingTime,
  getDeviceTheme,
  hexToRgbA,
} from "../helpers/Functions";
import { numberImageIds } from "../helpers/Variables";
import { Context } from "../context/BlogContext";
import PostTags from "../components/PostTags";
import RealatedPosts from "../components/RelatedPosts";
import LikeMe from "../components/common/LikeMe";
import { Header } from "react-native-elements";
import Moment from "moment";
import "moment/src/locale/tr";
import iframe from "@native-html/iframe-plugin";
import HTML from "react-native-render-html";
import WebView from "react-native-webview";
import { Feather } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import TimeAnimation from "../assets/time.json";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import { IS_IPHONE_X } from "../utils/navbar";
import { socket } from "../utils/io";
import PlayIcon from "../assets/images/svg/play-button.svg";
import BlogVideoItem from "../components/video/BlogVideoItem";

const ShowScreen = ({ navigation }) => {
  const { state, setState, getSinglePost } = useContext(Context);

  // console.log("uriPrefix", uriPrefix);

  // console.log(navigation, props);
  const colorScheme = useColorScheme();
  const Styles = getStyleSheet(colorScheme);
  const isFakeLight = colorScheme === "light";
  const isLight = getDeviceTheme(colorScheme) === "light";
  const contentWidth = useWindowDimensions().width;
  const computeEmbeddedMaxWidth = (availableWidth) => {
    return Math.min(availableWidth, 500);
  };
  let showView = useRef();
  const timeAnimationRef = useRef();
  const likeAnimRef = useRef();
  const [isLoaded, setIsLoaded] = useState(false);
  const [singlePostData, setSinglePostData] = useState(null);
  const [htmlData, sethtmlData] = useState(null);
  // const sourceKey = navigation.getParam("sourceKey") || false;
  // const storedItem = navigation.getParam("props").storedItem || false;
  const scrollTop = navigation.getParam("props").scrollTop || false;

  const blogPost = /*
  sourceKey
    ? state[sourceKey].find(
        (item) =>
          item[navigation.getParam("pairKey")] ===
          navigation.getParam("pairValue"),
      )
    :*/ navigation.getParam(
    "item",
  );

  let htmlContent = blogPost.content;
  //fix old youtube embed videos
  if (typeof htmlContent !== "undefined") {
    htmlContent = htmlContent
      .replace(
        /\[embed]/g,
        '<figure class="wp-block-embed-youtube wp-block-embed is-type-video is-provider-youtube wp-embed-aspect-16-9 wp-has-aspect-ratio"><div class="wp-block-embed__wrapper">',
      )
      .replace(/\[\/embed]/g, "</div></figure>");
  }

  const liked = navigation.getParam("liked");
  const blogPostCategoryId = findPostLastCategoryId(
    blogPost.term_id,
    state.categories,
  );

  const date = Moment.utc(blogPost.indate);
  const formattedDate = date.format("D MMMM, YYYY");
  const authorName = blogPost.author_name;
  const categoryNames = categoryIdsToString(blogPost.term_id, state.categories);

  useEffect(() => {
    let isSubscribed = true;
    let meIsloaded = true;

    if (isSubscribed) {
      if (scrollTop) {
        showView.refs.ScrollView.scrollTo({
          x: 0,
          y: 0,
          animated: false,
        });
      }
      InteractionManager.runAfterInteractions(() => {
        // setState({
        //   related_loading: true,
        // });

        setIsLoaded(false);
        getPostExtraData(blogPost.id, blogPostCategoryId);
        timeAnimationRef.current.play(0, 150);
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
    let isSubscribed = true;
    setIsLoaded(false);

    if (isSubscribed) {
      InteractionManager.runAfterInteractions(() => {
        getPostExtraData(blogPost.id, blogPostCategoryId);
        timeAnimationRef.current.play(0, 150);

        const listener = navigation.addListener("didFocus", () => {
          if (scrollTop) {
            showView.refs.ScrollView.scrollTo({
              x: 0,
              y: 0,
              animated: false,
            });
            // setState({
            //   related_loading: true,
            // });
            setIsLoaded(false);
            getPostExtraData(blogPost.id, blogPostCategoryId);

            timeAnimationRef.current.play(0, 150);
          }
        });
        setIsLoaded(true);
        listener.remove();
      });
    }

    return () => {
      isSubscribed = false;
    };
  }, []);

  const getPostExtraData = async (postId, catId) => {
    socket.connect();
    socket.emit("postTag", postId, catId, 0, function (data) {
      setSinglePostData(data);
    });
  };

  const aToPressableRenderer = (
    htmlAttribs,
    children,
    convertedCSSStyles,
    passProps,
  ) => {
    const href = htmlAttribs.href.replace(/\/$/, "");

    const fetchLinkPost =
      typeof state.sharedPosts.find((post) => {
        return post.url === href;
      }) === "undefined";

    if (fetchLinkPost) {
      getSinglePost(href);
    }

    return (
      <Text key={passProps.key + Math.random(100)}>
        <Text
          onPress={() => {
            typeof state.sharedPosts.find((post) => {
              return post.url === href;
            }) != "undefined" &&
              navigation.navigate("ShareShow", {
                sourceKey: "sharedPosts",
                pairKey: "url",
                pairValue: href,
                slug: href,
              });
          }}
        >
          <Text
            style={
              htmlAttribs.isHeading
                ? [
                    styles.goToSlugPostText,
                    styles.headingStyle,
                    styles.headingFontSize,
                  ]
                : styles.goToSlugPostText
            }
          >
            {htmlAttribs.data}
          </Text>
        </Text>
      </Text>
    );
  };
  const aiframeRenderer = (
    htmlAttribs,
    children,
    convertedCSSStyles,
    passProps,
  ) => {
    const youtubeId = htmlAttribs.youtubeId;
    const src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

    return <BlogVideoItem key={`byt-${youtubeId}`} item={youtubeId} />;
  };

  const renderers = {
    iframe,
    aiframe: {
      renderer: aiframeRenderer,
      wrapper: "View",
    },
    aToPressable: {
      renderer: aToPressableRenderer,
      wrapper: "Text",
    },
  };

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

  const headerElementOffset = Constants.statusBarHeight + 42;

  useEffect(() => {
    Animated.timing(fadeInContentOpacity, {
      duration: 1500,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [isLoaded, fadeInContentOpacity]);

  const preparedHTML = useMemo(() => {
    return (
      <HTML
        source={{ html: htmlContent }}
        contentWidth={contentWidth}
        computeEmbeddedMaxWidth={computeEmbeddedMaxWidth}
        baseFontStyle={{
          ...styles.baseFontStyle,
          ...{ color: getDefaultColor(colorScheme, true, 0.8) },
        }}
        containerStyle={{
          paddingHorizontal: 20,
        }}
        alterNode={(node) => {
          const { name } = node;
          if (
            name === "img" &&
            numberImageIds.some(
              (val) => node.attribs.class.indexOf(`wp-image-${val}`) !== -1,
            )
          ) {
            node.attribs = {
              ...(node.attribs || {}),
              style: `tintColor:${getDefaultColor(colorScheme, true)};`,
            };
            return node;
          }
        }}
        renderers={renderers}
        WebView={WebView}
        // defaultWebViewProps={
        //   {
        //     /* Any prop you want to pass to all WebViews */
        //   }
        // }
        renderersProps={{
          iframe: {
            scalesPageToFit: true,
            webViewProps: {
              allowsInlineMediaPlayback: true,
              containerStyle: {
                marginLeft: -20,
                width: contentWidth,
                marginVertical: 20,
              },
            },
          },
        }}
        onParsed={(dom, RNElements) => {
          // console.log(RNElements);
          RNElements.map((item, index) => {
            if (
              item.tagName === "figure" &&
              item.attribs.class &&
              item.attribs.class.includes("wp-block-embed")
            ) {
              const src = item.children[0].children[0].data;
              // console.log(src);
              const embedSrc = src
                .replace("https://youtu.be", "https://www.youtube.com/embed")
                .replace(
                  "https://www.youtube.com/watch?v=",
                  "https://www.youtube.com/embed/",
                );

              const youtubeId = embedSrc.replace(
                "https://www.youtube.com/embed/",
                "",
              );

              if (embedSrc) {
                const ad = {
                  wrapper: "View",
                  tagName: "aiframe",
                  attribs: {
                    src: `${embedSrc}?modestbranding=1&controls=0&iv_load_policy=3&hl=tr`,
                    youtubeId,
                  },
                  parent: false,
                  parentTag: false,
                  nodeIndex: null, //item.nodeIndex + 1,
                };
                // RNElements.splice(index + 1, 0, ad);
                RNElements[index] = ad;
              }
            }
          });
          // replace <a> which contains 10layn.com with <Pressable>
          const findChildText = (d, e, index) => {
            if ("data" in e.children[0] && e.children[0].data) {
              // console.log("hottori", e.children[0].data);
              d.attribs.data = e.children[0].data;
              return e.children[0].data;
            } else e.children[0] && findChildText(d, e.children[0]);

            // return res;
          };
          const cb = (e, index) => {
            if (e.tagName === "a" && e.attribs.href.includes("10layn.com")) {
              // console.log(e);

              e.wrapper = "View";
              e.attribs.isHeading = e.parentTag === "h2";
              e.tagName = "aToPressable";
              e.attribs.href = e.attribs.href
                .replace("https://10layn.com/", "")
                .replace("http://10layn.com/", "");
              findChildText(e, e);
            }
            e.children && e.children.forEach(cb);
          };
          RNElements.forEach(cb);

          return RNElements;
        }}
        onLinkPress={(event, href, htmlAttribs) => {
          //navigate outside links to webviewscreen
          if (!href.includes("10layn.com")) {
            // console.log(href);

            navigation.navigate("WebView", {
              url: href,
            });
            return false;
          }
        }}
        listsPrefixesRenderers={{
          ul: (htmlAttribs, children, convertedCSSStyles, passProps) => {
            return (
              <Text
                style={{
                  color: getDefaultColor(colorScheme, true),
                  fontSize: 10,
                  lineHeight: 22,
                  marginRight: 5,
                }}
              >
                {"\u2B24"}
              </Text>
            );
          },
        }}
        htmlParserOptions={{
          decodeEntities: true,
          xmlMode: false,
        }}
        classesStyles={{
          "wp-block-image": {
            textAlign: "center",
            marginBottom: 10,
          },
          aligncenter: {
            marginVertical: 18,
          },
          alignnone: {
            marginVertical: 18,
          },
        }}
        tagsStyles={{
          img: {
            marginTop: 20,
          },
          strong: {
            fontSize: 18,
            color: getDefaultColor(colorScheme, true),
          },
          p: {
            color: getDefaultColor(colorScheme, true, 0.8),
            marginTop: 10,
          },
          ul: {
            paddingVertical: 15,
          },
          li: {
            color: getDefaultColor(colorScheme, true, 0.8),
            fontSize: 18,
          },
          h2: {
            ...styles.headingStyle,
            ...styles.headingFontSize,
            ...{ color: getDefaultColor(colorScheme, true) },
          },
          h3: {
            color: getDefaultColor(colorScheme, true),
            fontSize: 22,
            marginTop: 20,
            marginBottom: 5,
            lineHeight: 26,
            fontFamily: "Montserrat-Bold",
            fontWeight: "normal",
          },
          h4: {
            color: getDefaultColor(colorScheme, true),
            fontSize: 20,
            marginTop: 15,
            marginBottom: 5,
            lineHeight: 20,
            fontFamily: "Montserrat-SemiBold",
            fontWeight: "normal",
          },
          blockquote: {
            textAlign: "center",
          },
        }}
      />
    );
  }, [htmlContent]);

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
            <ImageBackground
              source={{ uri: blogPost.image_url }}
              style={styles.image}
              fadeDuration={5000}
            >
              <View style={[styles.heroBgMask, { width: contentWidth }]}></View>
            </ImageBackground>
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
                    { color: hexToRgbA("#FFFFFF", 0.75) },
                  ]}
                >
                  {calculatePostReadingTime(blogPost.content)}
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
                      color: hexToRgbA("#FFFFFF", 0.75),
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
                {preparedHTML}
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

const onShare = async (blogPost) => {
  // console.log(blogPost);
  try {
    const result = await Share.share({
      subject: `${blogPost.title} | 10layn`,
      message: `${blogPost.title} | 10layn`,
      url: `https://xneda.com/disk/index.html?post=${blogPost.url}`,
      title: `${blogPost.title} | 10layn`,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    alert(error.message);
  }
};

export default ShowScreen;
