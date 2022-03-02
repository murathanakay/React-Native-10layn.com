import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Text,
  View,
  Pressable,
  ImageBackground,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import YoutubeIframe, { getYoutubeMeta } from "react-native-youtube-iframe";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PlayIcon from "../../assets/images/svg/play-button.svg";
import InView from "react-native-component-inview";
import FooterIndicator from "../common/FooterIndicator";

const BlogVideoItem = ({ item }) => {
  const [modalVisible, showModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);

  const contentWidth = useWindowDimensions().width;

  const checkVisible = (isVisible) => {
    if (isVisible) {
      setIsInView(isVisible);
    } else {
      setIsInView(isVisible);
    }
  };

  const onVideoPress = useCallback((videoId) => {
    showModal(true);
    setSelectedVideo(videoId);
  }, []);

  useEffect(() => {
    getProgress(item).then((p) => {
      setProgress(p);
    });
  }, [modalVisible]);

  const closeModal = useCallback(() => showModal(false), []);

  return (
    <InView onChange={(isVisible) => checkVisible(isVisible)}>
      <View
        key={item}
        style={{
          width: contentWidth,
        }}
      >
        {!modalVisible ? (
          <VideoItem videoId={item} onPress={onVideoPress} />
        ) : (
          <VideoModal
            key={`vi-${item}`}
            visible={modalVisible}
            videoId={selectedVideo}
            onClose={closeModal}
            isInView={isInView}
          />
        )}
      </View>
    </InView>
  );
};

const getProgress = async (videoId) => {
  let completed = 0;
  const status = await getVideoProgress(videoId);
  if (status?.completed) {
    completed += 1;
  }
  return completed;
};

// const ProgressBar = ({ progress }) => {
//   const width = (progress || 0) + "%";
//   return (
//     <View style={{ borderWidth: 1, marginVertical: 16 }}>
//       <View
//         style={{
//           backgroundColor: "green",
//           height: 10,
//           width,
//         }}
//       />
//     </View>
//   );
// };

const VideoItem = ({ videoId, onPress }) => {
  const contentWidth = useWindowDimensions().width;
  const [videoMeta, setVideoMeta] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let videoItemActive = true;
        getYoutubeMeta(videoId).then((data) => {
          if (videoItemActive) {
            setVideoMeta(data);
          }
        });
      } catch (e) {}
    })();

    return () => {
      // second, we return an anonymous clean up function
      videoItemActive = false;
    };
  }, [videoId]);

  if (videoMeta) {
    return (
      <View key={`im-${videoId}`} style={{ position: "relative" }}>
        <Pressable
          style={{ flex: 1, alignItems: "stretch" }}
          onPress={() => onPress(videoId)}
        >
          <ImageBackground
            source={{ uri: videoMeta.thumbnail_url }}
            style={{
              height: 280,
              width: contentWidth,
              marginLeft: -20,
              resizeMode: "cover",
              alignItems: "center",
              position: "relative",
            }}
          >
            <PlayIcon
              style={{
                width: 70,
                height: 70,
                marginBottom: "auto",
                marginTop: "auto",
                alignSelf: "center",
                tintColor: "white",
              }}
            />
            <View
              style={{
                marginTop: 0,
                marginBottom: "auto",
                width: "100%",
                backgroundColor: "rgba(0,0,0,.2)",
                padding: 10,
                position: "absolute",
                bottom: -20,
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                {videoMeta.title}
              </Text>
            </View>
          </ImageBackground>
        </Pressable>
      </View>
    );
  }
  return null;
};

const VideoModal = ({ videoId, onClose, isInView, visible }) => {
  const contentWidth = useWindowDimensions().width;
  const playerRef = useRef(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      playerRef.current?.getCurrentTime().then((data) => {
        saveVideoProgress({
          videoId,
          completed,
          timeStamp: data,
        });
      });
    }, 2000);

    return () => {
      clearInterval(timer);
    };
  }, [videoId, completed]);

  const onPlayerReady = useCallback(() => {
    setLoading(false);
    getVideoProgress(videoId)
      .then((data) => {
        if (data.timeStamp) {
          playerRef.current?.seekTo(data.timeStamp);
        }
      })
      .catch(() => {
        return null;
      });
  }, [videoId]);

  return (
    <View
      key={`vim-${videoId}`}
      style={{
        width: contentWidth,
        height: 280,
        marginLeft: -20,
        alignSelf: "stretch",
        position: "relative",
      }}
    >
      {!loading && (
        <FooterIndicator
          loadingMore={true}
          hideText={true}
          style={{
            paddingVertical: 0,
            display: "inline",
            top: "50%",
            left: "50%",
            marginLeft: -18,
            marginTop: -18,
            position: "absolute",
          }}
        ></FooterIndicator>
      )}
      <YoutubeIframe
        webViewStyle={{
          marginTop: 25,
          flex: 1,
          alignItems: "stretch",
          height: "100%",
          marginBottom: "auto",
        }}
        ref={playerRef}
        play={isInView}
        videoId={videoId}
        height={280}
        onReady={onPlayerReady}
        onChangeState={(state) => {
          setLoading(state);
          console.log(state);
          if (state === "ended") {
            setCompleted(true);
          }
        }}
        initialPlayerParams={{
          playerLang: "tr",
          showClosedCaptions: false,
          controls: false,
          modestbranding: false,
        }}
      />
    </View>
  );
};

const saveVideoProgress = ({ videoId, completed, timeStamp }) => {
  const data = {
    completed,
    timeStamp,
  };

  return AsyncStorage.setItem(videoId, JSON.stringify(data));
};

const getVideoProgress = async (videoId) => {
  const json = await AsyncStorage.getItem(videoId);
  if (json) {
    return JSON.parse(json);
  }
  return {
    completed: false,
    timeStamp: 0,
  };
};

export default BlogVideoItem;
