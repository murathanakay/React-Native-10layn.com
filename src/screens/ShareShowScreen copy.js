import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  View,
  Text,
  Alert,
  Pressable,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  ImageBackground,
  Share,
  ActivityIndicator,
} from "react-native";
import { NavigationActions } from "react-navigation";
import { useColorScheme } from "react-native-appearance";
import getStyleSheet from "../styles/BaseStyles";
import {
  getDefaultColor,
  categoryIdsToString,
  findPostLastCategoryId,
  calculatePostReadingTime,
} from "../helpers/Functions";
import { numberImageIds } from "../helpers/Variables";
import { Context } from "../context/BlogContext";
import BlogPostItem from "../components/BlogPostItem";
import { Header } from "react-native-elements";
import Logo from "../assets/images/logo.svg";
import Moment from "moment";
import "moment/src/locale/tr";
import iframe from "@native-html/iframe-plugin";
import HTML from "react-native-render-html";
import WebView from "react-native-webview";
import { Feather } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import TimeAnimation from "../assets/time.json";

const ShareShowScreen = ({ navigation }) => {
  const { state, setState, getPostExtraData, getSinglePost } = useContext(
    Context,
  );
  const colorScheme = useColorScheme();
  const Styles = getStyleSheet(colorScheme);
  const isLight = colorScheme === "light";
  const contentWidth = useWindowDimensions().width;
  const computeEmbeddedMaxWidth = (availableWidth) => {
    return Math.min(availableWidth, 500);
  };
  const showView = useRef();

  const timeAnimationRef = useRef();

  const slug = navigation.getParam("slug").replace(/\/$/, "");
  let blogPost = navigation.getParam("item") || false,
    date,
    formattedDate,
    authorName,
    categoryNames,
    blogPostCategoryId,
    props = navigation.getParam("props") || false;

  const scrollTop = props && "scrollTop" in props ? props.scrollTop : false;

  useEffect(() => {
    if (scrollTop) {
      showView.current.scrollTo({
        x: 0,
        y: 0,
        animated: true,
      });

      setState({
        related_loading: true,
      });

      getPostExtraData(blogPost.id, blogPostCategoryId);
    }
  }, [blogPost.id]);

  // console.log("ShareShowScreen", slug, navigation);

  // console.log(fromPost);

  useEffect(() => {
    if (
      !(
        state.sharedPosts &&
        state.sharedPosts.map((post) => {
          // console.log(post.url, slug);
          return post.url === slug;
        }).length
      )
    ) {
      getSinglePost(slug);
    }
  }, []);

  if (!state.loadingSharedPost) {
    blogPost =
      blogPost ||
      state.sharedPosts.find((post) => {
        return post.url === slug;
      });

    blogPostCategoryId = findPostLastCategoryId(
      blogPost.term_id,
      state.categories,
    );

    // console.log("blogPost", blogPost);

    // return <Text>Hottori</Text>;
    date = Moment.utc(blogPost.indate);
    formattedDate = date.format("D MMMM, YYYY");
    authorName = blogPost.author_name;
    categoryNames = categoryIdsToString(blogPost.term_id, state.categories);
  }

  useEffect(() => {
    getPostExtraData(blogPost.id, blogPostCategoryId);
    timeAnimationRef.current.play(0, 150);

    const listener = navigation.addListener("didFocus", () => {
      if (scrollTop) {
        showView.current.scrollTo({
          x: 0,
          y: 0,
          animated: true,
        });
        setState({
          related_loading: true,
        });

        timeAnimationRef.current.play(0, 150);
      }
      getPostExtraData(blogPost.id, blogPostCategoryId);
    });

    return () => {
      listener.remove();
    };
  }, []);

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
      <Pressable
        key={passProps.key + Math.random(100)}
        onPress={() => {
          typeof state.sharedPosts.find((post) => {
            return post.url === href;
          }) != "undefined" &&
            navigation.push("ShareShow", {
              sourceKey: "sharedPosts",
              pairKey: "url",
              pairValue: href,
              slug: href,
            });
        }}
      >
        <Text style={styles.goToSlugPostText}>{htmlAttribs.data}</Text>
      </Pressable>
    );
  };

  const renderers = {
    iframe,
    aToPressable: {
      renderer: aToPressableRenderer,
      wrapper: "Text",
    },
  };

  return (
    <>
      <Header
        barStyle={isLight ? "light-content" : "dark-content"}
        backgroundColor={getDefaultColor(colorScheme, false)}
        leftComponent={
          <Pressable
            onPress={() => {
              navigation.pop();
            }}
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
          <View style={{ height: 32 }}>
            <Logo
              width={36}
              height={36}
              style={{ fill: getDefaultColor(colorScheme, true) }}
            />
          </View>
        }
        rightComponent={
          <View style={{ height: 32, alignItems: "flex-end" }}>
            <Pressable style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 22,
                  color: isLight ? "black" : "white",
                  fontWeight: "500",
                  alignSelf: "flex-end",
                }}
              >
                Paylaş
              </Text>
            </Pressable>
          </View>
        }
        containerStyle={{
          borderBottomColor: isLight
            ? "rgba(0,0,0,.15)"
            : "rgba(255,255,255,.15)",
          paddingVertical: 5,
        }}
      ></Header>

      <ScrollView
        ref={showView}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={{ backgroundColor: "black", color: "white" }}>
          {state.loadingSharedPost ? (
            <ActivityIndicator />
          ) : (
            <>
              <ImageBackground
                source={{ uri: blogPost.image_url }}
                style={styles.image}
              >
                <View style={styles.heroContainer}>
                  <View style={styles.heroInnerContainer}>
                    <Text numberOfLines={1} style={styles.dateAndCategories}>
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
                    <Text style={styles.timeToReadinMin}>
                      {calculatePostReadingTime(blogPost.content)}
                    </Text>
                  </View>
                  <Text
                    style={styles.title}
                    adjustsFontSizeToFit={true}
                    numberOfLines={2}
                    minimumFontScale={0.9}
                  >
                    {blogPost.title}
                  </Text>
                  <Text style={Styles.author}>{`Yazar: ${authorName}`}</Text>
                </View>
              </ImageBackground>
              <HTML
                source={{ html: blogPost.content }}
                contentWidth={contentWidth}
                computeEmbeddedMaxWidth={computeEmbeddedMaxWidth}
                baseFontStyle={styles.baseFontStyle}
                containerStyle={{
                  paddingHorizontal: 20,
                }}
                alterNode={(node) => {
                  const { name } = node;
                  if (
                    name === "img" &&
                    numberImageIds.some(
                      (val) =>
                        node.attribs.class.indexOf(`wp-image-${val}`) !== -1,
                    )
                  ) {
                    node.attribs = {
                      ...(node.attribs || {}),
                      style: `tintColor:white;`,
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
                      item.attribs.class.includes("wp-block-embed")
                    ) {
                      const src = item.children[0].children[0].data;
                      // console.log(src);
                      const embedSrc = src

                        .replace(
                          "https://youtu.be",
                          "https://www.youtube.com/embed",
                        )
                        .replace(
                          "https://www.youtube.com/watch?v=",
                          "https://www.youtube.com/embed/",
                        );

                      if (embedSrc) {
                        const ad = {
                          wrapper: "Text",
                          tagName: "iframe",
                          attribs: {
                            src: `${embedSrc}?modestbranding=1&controls=0&iv_load_policy=3&hl=tr`,
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
                  const cb = (e, index) => {
                    if (
                      e.tagName === "a" &&
                      e.attribs.href.includes("10layn.com")
                    ) {
                      e.wrapper = "View";
                      e.tagName = "aToPressable";
                      e.attribs.href = e.attribs.href
                        .replace("https://10layn.com/", "")
                        .replace("http://10layn.com/", "");
                      e.attribs.data = e.children[0].data;
                    }
                    e.children && e.children.forEach(cb);
                  };
                  RNElements.forEach(cb);

                  return RNElements;
                }}
                listsPrefixesRenderers={{
                  ul: (
                    htmlAttribs,
                    children,
                    convertedCSSStyles,
                    passProps,
                  ) => {
                    return (
                      <Text
                        style={{
                          color: "#ddd",
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
                alterChildren={(node) => {
                  // let { name } = node;
                }}
                htmlParserOptions={{
                  decodeEntities: true,
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
                    color: "#ddd",
                    // marginLeft: 40,
                  },
                  p: {
                    color: "#ddd",
                  },
                  ul: {
                    paddingVertical: 15,
                  },
                  li: {
                    color: "#ddd",
                    fontSize: 18,
                  },
                  h2: {
                    textAlign: "center",
                    color: "#ddd",
                    fontSize: 28,
                    paddingHorizontal: 10,
                    marginBottom: 15,
                    lineHeight: 28,
                  },
                }}
              />
            </>
          )}
        </View>
        <View
          style={{
            marginVertical: 15,
            borderTopColor: "#222",
            borderTopWidth: 1,
            paddingTop: 25,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 24,
              marginBottom: 25,
              paddingLeft: 15,
            }}
          >
            İlginizi Çekebilir
          </Text>

          <View>
            <View>
              {
                // console.log(showView),
                !state.related_loading ? (
                  typeof state.related_posts !== "undefined" &&
                  state.related_posts.map((item, i) => (
                    <View key={`rc-${item.id}`}>
                      <BlogPostItem
                        screen="ShareShow"
                        item={item}
                        {...{
                          scrollTop: true,
                        }}
                        onPress={() => {
                          navigation.push("ShareShow", {
                            item,
                            slug: item.url,
                            props: {
                              scrollTop: true,
                            },
                          });
                        }}
                      />
                    </View>
                  ))
                ) : (
                  <ActivityIndicator animating size="large" color="#eee" />
                )
              }
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    backgroundColor: "#000",
  },
  heroContainer: {
    height: 360,
    paddingVertical: 15,
    position: "relative",
    position: "relative",
    backgroundColor: "rgba(0,0,0,.6)",
    flexDirection: "column",
    alignItems: "flex-end",
    paddingHorizontal: 10,
  },
  heroInnerContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
    marginTop: "auto",
  },
  dateAndCategories: {
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
    flex: 1,
    color: "#ddd",
  },
  timerAnimation: {
    width: 40,
    height: 40,
    marginTop: "auto",
    marginBottom: "auto",
  },
  timeToReadinMin: {
    marginLeft: "auto",
    color: "#999",
    marginTop: "auto",
    marginBottom: "auto",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    height: 360,
    marginBottom: 20,
  },
  title: {
    alignContent: "flex-end",
    alignSelf: "flex-start",
    alignItems: "flex-end",
    color: "rgba(255,255,255,.95)",
    fontSize: 27,
    backgroundColor: "rgba(0,0,0,.1)",
    borderRadius: 6,
    // paddingHorizontal: 10,
    paddingVertical: 5,
    fontWeight: "700",
  },
  baseFontStyle: {
    fontSize: 18,
    color: "#ddd",
    lineHeight: 24,
  },
  goToSlugPostText: {
    fontWeight: "700",
    color: "white",
    fontSize: 18,
  },
});

export default ShareShowScreen;
