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
import CachedImage from "react-native-expo-cached-image";

import SingleBlogPostItem from "../components/post/SingleBlogPostItem";

import RenderHtml from "../components/post/RenderHtml";
import { singlePostProps } from "../utils/singlePostProps";

const ShowScreen = ({ navigation }) => {
  const { state, setState, getSinglePost } = useContext(Context);

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
  // getSinglePost(blogPost.url);

  // console.log(blogPost);
  return <SingleBlogPostItem navigation={navigation} blogPost={blogPost} />;
};

export default ShowScreen;
