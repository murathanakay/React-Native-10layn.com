import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  SafeAreaView,
  Text,
  FlatList,
  Image,
  View,
  Pressable,
  ImageBackground,
  Modal,
  useWindowDimensions,
} from "react-native";
import YoutubeIframe, { getYoutubeMeta } from "react-native-youtube-iframe";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PlayIcon from "../../assets/images/svg/play-button.svg";

const BlogVideoItem = ({ item }) => {
  const [modalVisible, showModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [progress, setProgress] = useState(0);

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
    <View key={item} style={{ flex: 1 }}>
      {!modalVisible ? (
        <VideoItem videoId={item} onPress={onVideoPress} />
      ) : (
        <VideoModal
          key={`vi-${item}`}
          visible={modalVisible}
          videoId={selectedVideo}
          onClose={closeModal}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ margin: 16 }}
        ListHeaderComponent={
          <>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              100 Seconds of Code
            </Text>
            <ProgressBar progress={progress * 100} />
          </>
        }
        data={videoSeries}
        renderItem={({ item }) => (
          <VideoItem videoId={item} onPress={onVideoPress} />
        )}
        keyExtractor={(item) => item}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeModal}
      >
        <VideoModal videoId={selectedVideo} onClose={closeModal} />
      </Modal>
    </SafeAreaView>
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

const ProgressBar = ({ progress }) => {
  const width = (progress || 0) + "%";
  return (
    <View style={{ borderWidth: 1, marginVertical: 16 }}>
      <View
        style={{
          backgroundColor: "green",
          height: 10,
          width,
        }}
      />
    </View>
  );
};

const VideoItem = ({ videoId, onPress }) => {
  const contentWidth = useWindowDimensions().width;
  const [videoMeta, setVideoMeta] = useState(null);
  useEffect(() => {
    let videoItemActive = true;
    getYoutubeMeta(videoId).then((data) => {
      if (videoItemActive) setVideoMeta(data);
    });

    return () => {
      // second, we return an anonymous clean up function
      videoItemActive = false;
    };
  }, [videoId]);

  if (videoMeta) {
    return (
      <View key={`im-${videoId}`}>
        <Pressable
          style={{ flex: 1, alignItems: "center" }}
          onPress={() => onPress(videoId)}
        >
          <ImageBackground
            source={{ uri: videoMeta.thumbnail_url }}
            style={{
              height: 280,
              width: contentWidth,
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

    return (
      <Pressable
        onPress={() => onPress(videoId)}
        style={{ flexDirection: "row", marginVertical: 16 }}
      >
        <Image
          source={{ uri: videoMeta.thumbnail_url }}
          style={{
            width: videoMeta.thumbnail_width / 4,
            height: videoMeta.thumbnail_height / 4,
          }}
        />
        <View style={{ justifyContent: "center", marginStart: 16 }}>
          <Text style={{ marginVertical: 4, fontWeight: "bold" }}>
            {videoMeta.title}
          </Text>
          <Text>{videoMeta.author_name}</Text>
        </View>
      </Pressable>
    );
  }
  return null;
};

const VideoModal = ({ videoId, onClose }) => {
  const contentWidth = useWindowDimensions().width;
  const playerRef = useRef(null);
  const [completed, setCompleted] = useState(false);

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
        marginLeft: -20,
      }}
    >
      <YoutubeIframe
        ref={playerRef}
        play={true}
        videoId={videoId}
        height={280}
        onReady={onPlayerReady}
        onChangeState={(state) => {
          if (state === "ended") {
            setCompleted(true);
          }
        }}
        style={{
          alignSelf: "center",
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
