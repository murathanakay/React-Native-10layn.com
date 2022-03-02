import React, { useContext } from "react";
import { Context } from "../context/BlogContext";
import { View, Text, Pressable, ImageBackground } from "react-native";
import { useColorScheme } from "react-native-appearance";
import { withNavigation } from "react-navigation";
import { categoryIdsToString } from "../helpers/Functions";
import getStyleSheet from "../styles/BaseStyles";
import Moment from "moment";
import "moment/src/locale/tr";
import LikeMe from "./common/LikeMe";
// import CachedImage from "react-native-expo-cached-image";

const BlogPostItem = React.memo(
  ({ item, navigation, sourceKey, liked, ...props }) => {
    const { state } = useContext(Context);
    const colorScheme = useColorScheme();
    const Styles = getStyleSheet(colorScheme);

    const date = Moment.utc(item.indate);
    const formattedDate = date.format("D MMMM, YYYY");
    const authorName = item.author_name;
    const categoryNames = categoryIdsToString(item.term_id, state.categories);

    return (
      <Pressable
        onPress={() => {
          props.onPress
            ? props.onPress()
            : navigation.push(props.screen ? props.screen : "Show", {
                id: item.id,
                sourceKey,
                item,
                liked,
                ...{ props },
              });
          // props.onPress && props.onPress();
        }}
        style={({ pressed }) => [
          Styles.postItemRowContainer,
          {
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <ImageBackground
          isBackground
          source={{ uri: item.image_url, cache: "force-cache" }}
          style={Styles.image}
        >
          <View style={Styles.postItemRow} className="post-item">
            <Text numberOfLines={1} style={Styles.date}>
              {formattedDate} - {categoryNames}
            </Text>
            <Text
              style={Styles.title}
              adjustsFontSizeToFit={true}
              numberOfLines={3}
              minimumFontScale={0.05}
            >
              {item.title}
            </Text>
            <Text style={Styles.author}>
              {`Yazar: ${authorName}`} - {item.id}
            </Text>
          </View>

          <LikeMe
            key={item.id}
            itemId={item.id}
            item={item}
            liked={liked}
            removeItem={props.removeItem}
          />
        </ImageBackground>
      </Pressable>
    );
  },
);

export default withNavigation(BlogPostItem);
