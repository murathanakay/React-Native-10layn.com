import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useColorScheme } from "react-native-appearance";
import BlogPostItem from "./BlogPostItem";
import getStyleSheet from "../styles/BaseStyles";
import { getDefaultColor, getDeviceTheme } from "../helpers/Functions";

const PostTags = ({ tags }) => {
  const colorScheme = useColorScheme();
  const Styles = getStyleSheet(colorScheme);
  const isLight = getDeviceTheme(colorScheme) === "light";

  return (
    <View
      style={{
        paddingHorizontal: 15,
        paddingVertical: 15,
        flexWrap: "wrap",
        flexDirection: "row",
        alignContent: "stretch",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {
        // console.log(showView),

        typeof tags !== "undefined" &&
          tags.map((item, i) => (
            <View
              style={{
                paddingVertical: 7,
                paddingHorizontal: 10,
                marginVertical: 10,
                marginHorizontal: 5,
                borderWidth: 1,
                borderColor: isLight ? "#ddd" : "#444",
                backgroundColor: isLight ? "#eee" : "#222",
                borderRadius: 16,
                flexGrow: 1,
                alignItems: "center",
              }}
              key={`tag-${item.term_id}`}
            >
              <Text style={{ color: isLight ? "#444" : "#CCC" }}>
                {item.name}
              </Text>
            </View>
          ))
      }
    </View>
  );
};

export default PostTags;
