import React from "react";
import { View, Text } from "react-native";

const SharedScreen = (props) => {
  console.log(props);
  const { navigation } = props;
  return <Text>{navigation.getParam("slug")}</Text>;
};

export default SharedScreen;
