import { Dimensions, Platform } from "react-native";

const { height: D_HEIGHT, width: D_WIDTH } = (() => {
  const { width, height } = Dimensions.get("window");
  if (width === 0 && height === 0) {
    return Dimensions.get("screen");
  }
  return { width, height };
})();

const X_WIDTH = 375;
const X_HEIGHT = 812;
const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const PRO_12MAX_WIDTH = 428;
const PRO_12MAX_HEIGHT = 926;

const IPHONE_13_WIDTH = 390;
const IPHONE_13_HEIGHT = 844;

export const IS_IPHONE_X = (() => {
  if (Platform.OS === "web") {
    return false;
  }
  return (
    (Platform.OS === "ios" &&
      ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
        (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT))) ||
    (D_HEIGHT === XSMAX_HEIGHT && D_WIDTH === XSMAX_WIDTH) ||
    (D_HEIGHT === XSMAX_WIDTH && D_WIDTH === XSMAX_HEIGHT) ||
    (D_HEIGHT === PRO_12MAX_HEIGHT && D_WIDTH === PRO_12MAX_WIDTH) ||
    (D_HEIGHT === IPHONE_13_HEIGHT && D_WIDTH === IPHONE_13_WIDTH)
  );
})();

export const rnd = (max = 256) => Math.random() * max;

export const generateColor = () => `rgb(${rnd()},${rnd()},${rnd()})`;
