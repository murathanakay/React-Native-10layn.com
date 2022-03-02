import React from "react";
import Svg, { Path } from "react-native-svg";

export const TabBg = ({ color = "#FFFFFF", ...props }) => {
  return (
    <Svg width={95} height={85} viewBox="0 0 95 85" {...props}>
      <Path
        d="M94.9,0v85H0V0c5.2,0,9.3,4.3,10,9.9C12.6,30.2,28.4,46,47.6,46S82.5,30.2,85,9.9C85.7,4.3,90,0,95,0C95,0,94.9,0,94.9,0z"
        fill={color}
      />
    </Svg>
  );
};
