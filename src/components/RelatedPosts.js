import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useColorScheme } from "react-native-appearance";
import BlogPostItem from "./BlogPostItem";
import { getDefaultColor } from "../helpers/Functions";

const RealatedPosts = ({ related_posts, related_loading }) => {
  const colorScheme = useColorScheme();
  return (
    <View
      style={{
        marginTop: 15,
        borderTopColor: getDefaultColor(colorScheme, true, 0.1),
        borderTopWidth: 1,
        paddingTop: 25,
      }}
    >
      <Text
        style={{
          color: getDefaultColor(colorScheme, true),
          fontSize: 22,
          marginBottom: 25,
          paddingLeft: 15,
          fontFamily: "Montserrat-SemiBold",
        }}
      >
        İlginizi Çekebilir
      </Text>

      <View>
        <View>
          {
            // console.log(showView),
            !related_loading ? (
              typeof related_posts !== "undefined" &&
              related_posts.map((item, i) => (
                <View key={`rc-${item.id}`}>
                  <BlogPostItem
                    item={item}
                    {...{
                      scrollTop: true,
                      isLoaded: false,
                    }}
                  />
                </View>
              ))
            ) : (
              <ActivityIndicator
                animating
                size="large"
                color={getDefaultColor(colorScheme, true)}
              />
            )
          }
        </View>
      </View>
    </View>
  );
};
export default RealatedPosts;
