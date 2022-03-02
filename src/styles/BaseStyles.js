import { StyleSheet } from "react-native";

export const Colors = {
  dark: {
    fontColor: "white",
    backgroundColor: "#000",
    dangerousLightColor: "#eee",
    transparentBackgroundColor: "rgba(0,0,0,.7)",
    titleColor: "#fafafa",
    dateColor: "#c9c9c9",
    borderColor: "rgba(255,255,255,.1)",
    borderColor2: "rgba(255,255,255,.05)",
    inputBackground: "#222",
  },
  light: {
    fontColor: "black",
    backgroundColor: "white",
    defaultColor: "#FFFFFF",
    transparentBackgroundColor: "rgba(0,0,0,.6)",
    superTransparentBackgroundColor: "rgba(0,0,0,.0)",
    titleColor: "white",
    dateColor: "#f9f9f9",
    borderColor: "rgba(0,0,0,.1)",
    borderColor2: "rgba(0,0,0,.05)",
    inputBackground: "#FFF",
  },
};

const baseContainerStyles = {
  flex: 1,
  flexGrow: 1,
  paddingBottom: 0,
  fontFamily: "Montserrat-SemiBold",
};
const listItemBaseStyles = {
  postItemRow: {
    flexDirection: "column",
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    position: "relative",
  },
  title: {
    fontSize: 22,
    width: "100%",
    marginBottom: "auto",
    fontFamily: "Montserrat-SemiBold",
    // marginTop: "auto",
  },
  date: {
    fontSize: 11,
    // width: "85%",
    marginBottom: 5,
    marginTop: "auto",
    alignSelf: "flex-start",
    fontFamily: "Montserrat",
  },
  author: {
    fontSize: 13,
    // width: "100%",
    marginBottom: 0,
    marginTop: 0,
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,.1)",
    fontFamily: "Montserrat",
  },
  fontSize22: {
    fontSize: 22,
    fontFamily: "Montserrat",
  },
  searchInput: {
    flex: 1,
    margin: 10,
    height: 44,
    borderWidth: 1,
    fontSize: 16,
    borderRadius: 35,
    paddingVertical: 5,
    paddingHorizontal: 15,
    fontFamily: "Montserrat",
  },
  searchMessageContainer: {
    borderWidth: 1,
    borderBottomWidth: 0,
    marginTop: 0,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 35,
    fontFamily: "Montserrat-SemiBold",
  },
  searchMessageArrow: {
    marginLeft: 29,
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 15,
    borderTopWidth: 15,
    borderRightColor: "transparent",
    transform: [{ rotate: "270deg" }],
    borderTopColor: "rgba(255,255,255,.1)",
  },
};

const lightStyleSheet = StyleSheet.create({
  container2: {
    ...baseContainerStyles,
    backgroundColor: Colors.light.defaultColor,
  },
  container: {
    ...baseContainerStyles,
    backgroundColor: Colors.light.defaultColor,
  },
  postItemRowContainer: {
    flex: 1,
  },
  postItemRow: {
    ...listItemBaseStyles.postItemRow,
    backgroundColor: Colors.light.transparentBackgroundColor,
  },
  title: {
    ...listItemBaseStyles.title,
    color: Colors.light.titleColor,
  },
  date: {
    ...listItemBaseStyles.date,
    color: Colors.light.dateColor,
  },
  author: {
    ...listItemBaseStyles.author,
    color: Colors.light.dateColor,
  },
  icon: {
    fontSize: 24,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    position: "relative",
  },
  categoryName: {
    ...listItemBaseStyles.fontSize22,
    color: Colors.light.fontColor,
  },
  searchInput: {
    ...listItemBaseStyles.searchInput,
    borderColor: Colors.light.borderColor,
    backgroundColor: Colors.light.inputBackground,
    color: Colors.light.fontColor,
  },
  searchMessageContainer: {
    ...listItemBaseStyles.searchMessageContainer,
    borderColor: Colors.light.borderColor,
    borderLeftColor: Colors.light.borderColor2,
    borderRightColor: Colors.dark.borderColor2,
  },
  searchMessageArrow: {
    ...listItemBaseStyles.searchMessageArrow,
    borderTopColor: Colors.light.borderColor,
  },
});

const darkStyleSheet = StyleSheet.create({
  container3: {
    ...baseContainerStyles,
    backgroundColor: "#1A1A1A",
  },
  container2: {
    ...baseContainerStyles,
    backgroundColor: Colors.dark.transparentBackgroundColor,
  },
  container: {
    ...baseContainerStyles,
    backgroundColor: Colors.dark.backgroundColor,
  },
  postItemRowContainer: {
    flex: 1,
  },
  postItemRow: {
    ...listItemBaseStyles.postItemRow,
    backgroundColor: Colors.dark.transparentBackgroundColor,
  },
  title: {
    ...listItemBaseStyles.title,
    color: Colors.dark.titleColor,
  },
  date: {
    ...listItemBaseStyles.date,
    color: Colors.dark.dateColor,
  },
  author: {
    ...listItemBaseStyles.author,
    color: Colors.dark.dateColor,
  },
  icon: {
    fontSize: 24,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    position: "relative",
  },
  categoryName: {
    ...listItemBaseStyles.fontSize22,
    color: Colors.dark.fontColor,
  },
  searchInput: {
    ...listItemBaseStyles.searchInput,
    borderColor: Colors.dark.borderColor,
    backgroundColor: Colors.dark.inputBackground,
    color: Colors.dark.fontColor,
  },
  searchMessageContainer: {
    ...listItemBaseStyles.searchMessageContainer,
    borderColor: Colors.dark.borderColor,
    borderLeftColor: Colors.dark.borderColor2,
    borderRightColor: Colors.dark.borderColor2,
  },
  searchMessageArrow: {
    ...listItemBaseStyles.searchMessageArrow,
    borderTopColor: Colors.dark.borderColor,
  },
});

// const helperClasses = (colorScheme) => {
//   return {
//     border: {
//       borderWidth: 1,
//       borderColor: Colors[colorScheme],
//     },
//     borderTop: {
//       borderTopWidth: 1,
//       border
//     }
//   };
// }

const ListScreenStyles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: "#000",
  },
  postItemRow: {
    flexDirection: "column",
    color: "#fff",
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    position: "relative",
    backgroundColor: "rgba(0,0,0,.6)",
  },
  date: {
    fontSize: 11,
    color: "#c9c9c9",
    width: "85%",
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "500",
    color: "#fafafa",
    width: "100%",
  },
  author: {
    fontSize: 12,
    color: "#c9c9c9",
    width: "100%",
    marginTop: 5,
  },
  icon: {
    fontSize: 24,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    position: "relative",
  },
});

export default function getStyleSheet(colorScheme) {
  return colorScheme === "light"
    ? lightStyleSheet
    : colorScheme === "dark"
    ? darkStyleSheet
    : lightStyleSheet;
}
