import React from "react";
import { View, useWindowDimensions } from "react-native";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import { useColorScheme } from "react-native-appearance";
import { getDefaultColor, getDeviceTheme } from "../helpers/Functions";

const BlogContentLoader = (props) => {
  const colorScheme = useColorScheme();
  const loaderWidth = useWindowDimensions().width;
  const isLight = getDeviceTheme(colorScheme) === "light";

  return (
    <View style={{ flex: 1 }}>
      <ContentLoader
        animate={true}
        speed={0.5}
        width={loaderWidth}
        height={500}
        viewBox="0 0 500 400"
        backgroundColor={isLight ? "#f2f2f2" : "#262626"}
        foregroundColor={isLight ? "#ecebeb" : "#444444"}
        style={{ width: loaderWidth }}
        {...props}
      >
        <Rect x="18" y="0" rx="3" ry="3" width="67" height="11" />
        <Rect x="94" y="0" rx="3" ry="3" width="140" height="11" />
        <Rect x="18" y="72" rx="3" ry="3" width="180" height="16" />
        <Rect x="242" y="72" rx="3" ry="3" width="242" height="16" />
        <Rect x="18" y="33" rx="3" ry="3" width="140" height="18" />
        <Rect x="285" y="33" rx="3" ry="3" width="198" height="18" />
        <Rect x="188" y="33" rx="3" ry="3" width="67" height="18" />
        <Rect x="18" y="105" rx="3" ry="3" width="469" height="20" />
        <Rect x="18" y="212" rx="3" ry="3" width="180" height="16" />
        <Rect x="242" y="212" rx="3" ry="3" width="242" height="16" />
        <Rect x="18" y="173" rx="3" ry="3" width="140" height="18" />
        <Rect x="285" y="173" rx="3" ry="3" width="198" height="18" />
        <Rect x="188" y="173" rx="3" ry="3" width="67" height="18" />
        <Rect x="18" y="245" rx="3" ry="3" width="469" height="20" />
        <Rect x="18" y="282" rx="3" ry="3" width="469" height="20" />
        <Rect x="18" y="319" rx="3" ry="3" width="67" height="18" />
        <Rect x="115" y="319" rx="3" ry="3" width="140" height="18" />
        <Rect x="285" y="318" rx="3" ry="3" width="198" height="18" />
        <Rect x="18" y="351" rx="3" ry="3" width="180" height="16" />
        <Rect x="242" y="351" rx="3" ry="3" width="242" height="16" />
        <Circle cx="247" cy="422" r="40" />
      </ContentLoader>
    </View>
  );
};

export default BlogContentLoader;
