import React from "react";
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Appearance } from "react-native-appearance";
import Storage from "../../utils/storage";
import LottieView from "lottie-react-native";

import { Context } from "../../context/BlogContext";
// import { ThemeProvider } from "react-native-elements";

// import HeartIcon from "../../assets/heart.json";

let HeartIcon;

class LikeMe extends React.PureComponent {
  static contextType = Context;
  state = {
    theme: Appearance.getColorScheme(),
    liked: false,
  };

  // constructor(props) {
  //   super(props);

  //   this._isMounted = false;

  //   this.state = {
  //     liked: false,
  //   };

  //   // console.log("LIKEME.js constructor", this.props.itemId, this.props.liked);
  // }

  componentDidMount(prevProps) {
    const { state, getLikes, setState } = this.context;

    this._isMounted = true;

    this._isMounted &&
      this.setState({
        liked: this.props.liked,
        getLikes,
        setState,
      });
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log(
    //   "LIKEME.js componentDidUpdate",
    //   this.props.itemId,
    //   this.state.liked,
    // );

    if (prevProps.liked !== this.props.liked) {
      // console.log(prevState.liked, this.state.liked);
      this._isMounted &&
        this.setState({
          liked: this.props.liked,
        });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  // shouldComponentUpdate

  handleLikeState = () => {
    if (this.state.liked) {
      Storage.load({
        key: "postLikes",
      })
        .then((res) => {
          const newLikes = [...res.likes, this.props.item];

          Storage.save({
            key: "postLikes",
            data: {
              likes: newLikes,
            },
          }).then(() => {
            //set likes callback through reducer
            //this.props.setLikes(newLikes);
            this.state.setState({
              likes: newLikes,
            });
          });
        })
        .catch(() => {
          Storage.save({
            key: "postLikes",
            data: {
              likes: [this.props.item],
            },
          });
        });

      this.animation.play(25, 59);
      if (global.heartAnimation) global.heartAnimation.play();
    } else {
      Storage.load({
        key: "postLikes",
      }).then((res) => {
        const newLikes = Array.from(res.likes).filter(
          (val) => val.id !== this.props.itemId,
        );

        Storage.save({
          key: "postLikes",
          data: {
            likes: newLikes,
          },
        }).then(() => {
          //set likes callback through reducer
          //this.props.setLikes(newLikes);
          this.state.setState({
            likes: newLikes,
          });
          // if (this.props.removeItem) this.state.getLikes();
        });
      });
      this.animation.reset();
    }
  };

  handleOnPressLike = () => {
    this._isMounted &&
      this.setState(
        (prevState) => ({ liked: !prevState.liked }),
        this.handleLikeState,
      );
  };

  render() {
    const { liked } = this.state;
    const style = this.props.style || {};

    return (
      <TouchableOpacity
        key={`tc-${this.props.itemId}`}
        onPress={this.handleOnPressLike}
        style={[styles.likeButton, style]}
      >
        <>
          <LottieView
            key={this.props.itemId}
            ref={(animation) => {
              this.animation = animation;
            }}
            style={{
              width: this.props.width || 46,
              height: this.props.height || 46,
            }}
            loop={false}
            speed={1.5}
            source={
              Platform.OS === "android" && this.state.theme === "dark"
                ? require("../../assets/heart-android-darkmode.json")
                : require("../../assets/heart.json")
            }
            progress={liked ? 1 : 0}
            enableMergePathsAndroidForKitKatAndAbove={true}
            resizeMode="contain"
          />
        </>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  likeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "rgba(0,0,0,0)",
    color: "#fff",
    padding: 5,
  },
});

export default LikeMe;
