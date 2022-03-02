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
import iframe from "@native-html/iframe-plugin";
import HTML from "react-native-render-html";
import WebView from "react-native-webview";
import { Context } from "../../context/BlogContext";
import { useColorScheme } from "react-native-appearance";
import getStyleSheet from "../../styles/BaseStyles";
import { numberImageIds } from "../../helpers/Variables";
import {
  getDefaultColor,
  categoryIdsToString,
  findPostLastCategoryId,
  calculatePostReadingTime,
  getDeviceTheme,
  hexToRgbA,
} from "../../helpers/Functions";
import BlogVideoItem from "../video/BlogVideoItem";

const RenderHtml = ({ navigation, htmlContent, contentWidth }) => {
  const { state, setState, getSinglePost } = useContext(Context);
  const colorScheme = useColorScheme();
  const Styles = getStyleSheet(colorScheme);
  const computeEmbeddedMaxWidth = (availableWidth) => {
    return Math.min(availableWidth, 500);
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
              navigation.navigate("ShowByLink", {
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

  //fix old youtube embed videos
  if (typeof htmlContent !== "undefined") {
    htmlContent = htmlContent
      .replace(
        /\[embed]/g,
        '<figure class="wp-block-embed-youtube wp-block-embed is-type-video is-provider-youtube wp-embed-aspect-16-9 wp-has-aspect-ratio"><div class="wp-block-embed__wrapper">',
      )
      .replace(/\[\/embed]/g, "</div></figure>");
  }

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

export default RenderHtml;
