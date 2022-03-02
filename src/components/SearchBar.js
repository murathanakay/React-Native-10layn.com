import React, { useRef } from "react";
import {
  Animated,
  View,
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Context } from "../context/BlogContext";
import { FontAwesome } from "@expo/vector-icons";
import DelayInput from "react-native-debounce-input";

import { getDefaultColor } from "../helpers/Functions";
import getStyleSheet from "../styles/BaseStyles";

class SearchBar extends React.PureComponent {
  static contextType = Context;
  state = {
    search: "",
    searchPage: 1,
    parentState: {},
    stopSearch: false,
    colorScheme: this.props.theme,
    // searchedData: {}
  };

  styles = getStyleSheet(this.props.theme);

  componentDidMount() {
    const { state, setState, searchPage, getSearchPosts } = this.context;

    this.setState({
      state,
      setState,
      searchPage,
      getSearchPosts,
      search: "",
      colorScheme: this.props.theme,
      searchCache: state.searchCache,
    });

    // console.log("fifi componentDidMount");
    this.focusListener = this.props.navigation.addListener("didFocus", () =>
      this.searchInput.focus(),
    );
  }

  componentWillUnmount() {
    this.focusListener.remove();
    this.setState({
      stopSearch: true,
    });

    if (search === "") {
      return;
    }
  }

  updateSearch = (search) => {
    const { setState } = this.state;

    console.log("search", search);

    if (search === "") {
      // return;

      // setState({
      //   searchPosts: [],
      //   searchLoading: false,
      //   searchStopLoading: true,
      //   searchShowMessage: search.length ? false : true,
      // });

      return false;
    }

    this.setState({
      stopSearch: false,
    });

    // console.log(this.state);
    this.setState((prevState) => {
      if (prevState.search !== search && !this.state.stopSearch) {
        return {
          stopSearch: false,
          search,
          prevSearch: prevState.search,
        };
      }
    });

    if (this.state.prevSearch !== this.state.search && !this.state.stopSearch)
      this.handleSearch();
  };

  preventSending = () => {
    this.setState({
      stopSearch: true,
    });
    return false;
  };

  handleSearch = () => {
    const { search } = this.state;
    const {
      state,
      setState,
      searchPage,
      searchCache,
      getSearchPosts,
    } = this.context;

    setState({
      searchLoading: true,
      searchPosts: [],
      searchStopLoading: false,
      searchShowMessage: search.length ? false : true,
    });

    // console.log("fokfok", search in state.searchCache, state.searchCache);

    if (search in state.searchCache) {
      console.log(search, state.searchCache);
      setState({
        searchLoading: false,
        searchPosts: state.searchCache[search],
      });
    } else {
      getSearchPosts(0, search);
    }

    this.setState({
      prevSearch: search,
      searchCache: state.searchCache,
    });

    // setState({
    //   searchCache: {
    //     ...{
    //       [search]: state.searchPosts,
    //     },
    //   },
    // });

    // console.log(state.searchCache);
  };

  searchClear = () => {
    const { setState } = this.state;
    this.setState(
      {
        search: "",
      },
      setState({
        searchPosts: [],
        searchShowMessage: true,
      }),
    );

    this.searchInput.clear();
  };

  render() {
    const { search } = this.state;

    return (
      <Animated.View>
        <View
          style={{
            position: "relative",
            // backgroundColor: "rgba(255,255,255,.03)",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            // borderBottomWidth: 1,
            // marginBottom: 0,
            // borderBottomColor: "rgba(255,255,255,.1)",
          }}
        >
          <DelayInput
            value={search}
            placeholder={`10layn'da arayın...`}
            minLength={3}
            maxLength={25}
            autoCapitalize="none"
            inputRef={(search) => (this.searchInput = search)}
            onChangeText={this.updateSearch}
            onChange={() => {
              return null;
            }}
            returnKeyType="done"
            // clearButtonMode="while-editing"
            blurOnSubmit={true}
            // onSubmitEditing={() => this.preventSending()}
            delayTimeout={600}
            autoCorrect={false}
            autoFocus={true}
            placeholderTextColor={getDefaultColor(
              this.state.colorScheme,
              true,
              0.15,
            )}
            style={this.styles.searchInput}
          />
          {search.length > 0 && !this.context.state.searchLoading && (
            <TouchableOpacity
              style={{
                position: "absolute",
                alignSelf: "center",
                right: 25,
                color: getDefaultColor(this.state.colorScheme, true),
              }}
              color={getDefaultColor(this.state.colorScheme, true)}
              onPress={this.searchClear}
            >
              <FontAwesome name="times-circle" size={18} color="#ddd" />
            </TouchableOpacity>
          )}
          {this.context.state.searchLoading && (
            <ActivityIndicator
              style={{
                position: "absolute",
                alignSelf: "center",
                right: 25,
                color: getDefaultColor(this.state.colorScheme, true),
              }}
              color={getDefaultColor(this.state.colorScheme, true)}
            />
          )}
        </View>
      </Animated.View>
    );
  }
}

export default SearchBar;
