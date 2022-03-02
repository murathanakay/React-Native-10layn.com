import React from "react";
import { View, Text, FlatList, Button, RefreshControl } from "react-native";
import { getDefaultColor, getDeviceTheme } from "../helpers/Functions";
import BlogPostItem from "./BlogPostItem";

const BlogPostList = React.memo(() => {
  return (
    <FlatList
      data={posts}
      onEndReached={() => handleLoadMore()}
      onEndReachedThreshold={0.2}
      ListFooterComponent={
        <FooterIndicator loadingMore={loading} error={error} />
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          title="Lütfen bekleyiniz..."
          tintColor={getDefaultColor(colorScheme, true)}
          titleColor={getDefaultColor(colorScheme, true)}
        />
      }
      showsVerticalScrollIndicator={false}
      keyExtractor={(blogPost) => blogPost.id.toString()}
      renderItem={({ item }) => {
        const liked = likes.length
          ? typeof likes.find((opt) => {
              return opt ? opt.id === item.id : false;
            }) === "undefined"
            ? false
            : true
          : false;

        return <BlogPostItem liked={liked} item={item} />;
      }}
    />
  );
});
