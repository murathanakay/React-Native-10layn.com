import React from "react";
import { Platform } from "react-native";
import Svg, { Path } from "react-native-svg";

export const Logo = ({ isLight, ...props }) => {
  return (
    <Svg id="logo-10layn" width={40} height={32} viewBox="0 0 40 32" {...props}>
      <Path
        fill={
          isLight ? "#000000" : Platform.OS === "ios" ? "#ffffff" : "#8a8a8a"
        }
        d="M23.9,0.1c-8.8,0-16,7.1-16,15.9s7.2,15.9,16,15.9c4.2,0,8-1.6,10.8-4.2c-3.8,0.1-5.2-1.9-5.8-1.6l0,0
	c-1.5,0.7-3.2,1.1-5,1.1c-6.3,0-11.3-5-11.3-11.3S17.7,4.6,23.9,4.6s11.3,5,11.3,11.3c0,2.6-0.9,5-2.4,6.9c0,0,0,0.1-0.2,0.2
	c-1.5,1.7,1.9,4.3,2.1,4.5c3.2-2.9,5.1-7.1,5.1-11.7C39.9,7.2,32.7,0.1,23.9,0.1z M0.1,6.4v25.5h4.7V0.1l0,0C2.7,5,0.1,5.3,0.1,6.4z
	"
      />
    </Svg>
  );
};
