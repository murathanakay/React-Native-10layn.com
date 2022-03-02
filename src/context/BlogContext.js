// import jsonServer from "../api/jsonServer";
import createDataContext from "./createDataContext";
import Storage from "../utils/storage";
import { fixYoutubeEmbed } from "../helpers/Functions";
import { socket } from "../utils/io";
import { useCallback } from "react";
socket.connect();

const blogReducer = (state, action) => {
  switch (action.type) {
    case "get_blogposts":
      const posts = action.payload.posts;

      const IndexStateObj = {
        posts:
          action.payload.page === 0
            ? Array.from(action.payload.posts)
            : [...state.posts, ...posts],
        page: action.payload.page,

        totalPage: action.payload.totalPage,
        total: action.payload.total,
        error: action.payload.error,
        storage: action.payload.storage,
      };

      if (state.categories.length === 0) {
        IndexStateObj.categories = action.payload.categories;
      }
      if (!state.likes || state.likes.length === 0) {
        IndexStateObj.likes = action.payload.likes;
      }

      const IndexState = {
        ...state,
        ...IndexStateObj,
      };

      const IndexPosts =
        action.payload.posts.status && action.payload.posts.status === 400
          ? state
          : IndexState;

      return IndexPosts;

    case "get_blogposts_by_category":
      const categoryId = action.payload.categoryId;
      const categorySlug = action.payload.categorySlug;

      const currentCategoryKey = `${categorySlug}${categoryId}`;
      const currentCategoryData = state.categoryPosts[currentCategoryKey] || [];

      const newPostDataWithSlug = action.payload.data; //[];

      const CategoryPosts = {
        ...state,
        ...{
          categoryPosts: {
            ...state.categoryPosts,
            ...{
              [currentCategoryKey]:
                currentCategoryData.length && action.payload.page !== 0
                  ? [...currentCategoryData, ...newPostDataWithSlug]
                  : newPostDataWithSlug,
            },
          },
        },
      };
      // console.log("CategoryPosts");

      return CategoryPosts;

    case "get_search_posts":
      //if (state.posts) console.log(state.posts.length);

      // console.log(action.payload);
      const SearchPosts =
        action.payload.searchPosts.status &&
        action.payload.searchPosts.status === 400
          ? state
          : {
              ...state,
              ...{
                searchPosts:
                  action.payload.searchPage === 0
                    ? Array.from(action.payload.searchPosts)
                    : [...state.searchPosts, ...action.payload.searchPosts],
                query: action.payload.query,
                searchPage: action.payload.searchPage,
                // searchtTotalPage: action.payload.searchtTotalPage,
                // searchTotal: action.payload.searchTotal,
                error: action.payload.error,
                refreshing: false,
                loadingMore: false,
                loading: false,
                searchLoading: false,
                searchStopLoading: action.payload.searchStopLoading,
                searchCache: {
                  ...state.searchCache,
                  ...{
                    [action.payload.query]:
                      action.payload.searchPage === 0
                        ? action.payload.searchPosts
                        : state.searchCache[action.payload.query],
                  },
                },
              },
            };

      return SearchPosts;

    case "get_single_post":
      const singlePost = {
        ...state,
        ...action.payload,
      };

      // console.log("singlePost", singlePost);
      return singlePost;

    case "get_single_post_from_slug":
      const shouldAdd =
        typeof state.sharedPosts.find((post) => {
          return post.url === action.payload.post.url;
        }) === "undefined";

      state.loadingSharedPost = false;
      shouldAdd && state.sharedPosts.push(action.payload.post);

      return state;

    case "set_state":
      const newState = Object.assign({}, state, action.payload);

      // return {
      //   ...state,
      //   ...{
      //     ...action.payload,
      //   },
      // };

      return newState;

    case "get_categories":
      return state;

    default:
      return state;
  }
};

const getLikes = (dispatch) => {
  return async (likes) => {
    try {
      // Storage.remove({
      //   key: "postLikes",
      // });
      await Storage.load({
        key: "postLikes",
      })
        .then((res) => {
          //console.log(`res.likes:`, res);

          // if ((likes && objectsAreSame(res.likes, likes)) || !likes)
          dispatch({
            type: "set_state",
            payload: {
              likes: res.likes,
            },
          });

          // callback();
          //return res.likes;
        })
        .catch((err) => {
          console.log("got err one", err);
          Storage.save({
            key: "postLikes",
            data: {
              likes: [],
            },
          });

          dispatch({
            type: "set_state",
            payload: { likes: [] },
          });
        });
    } catch (err) {
      console.log(err);
    }
  };
};

const setState = (dispatch) => {
  return (newObject, callback) => {
    dispatch({
      type: "set_state",
      payload: newObject,
    });
  };
};

/**
 * @function getBlogPosts(page);
 * @todo
 * We need to check for new posts from the server,
 * so must create a testing server for 10layn.com
 * 1-) Can add new posts to compare with local storage data
 * 2-) If new posts detected then store new data to another dispatch object
 * 3-) Pass a true value if data has been changed to the Index screen
 * 4-) Turn back and update state with passing new posts(Whole first page posts) to the dispatch function
 * 5-) Check for the updated state.posts value in the Index screen.
 */

const getBlogPosts = (dispatch) => {
  return async ({
    page,
    setLoading,
    setRefreshing,
    fetch,
    refresh,
    lastPost,
  }) => {
    // Storage.remove({
    //   key: "state",
    // });

    const pg = parseInt(page),
      firstLoad = pg === 0,
      action = firstLoad ? "get_all" : "posts",
      pgOrUid = firstLoad ? 0 : pg;

    // ((!firstLoad && socket.disconnected) || (firstLoad && refresh)) &&
    socket.open();

    //check async storage first
    if (firstLoad && !fetch) {
      await Storage.getBatchData([
        { key: "state" },
        { key: "postLikes" },
        // { key: "baseFontsize" },
      ])
        .then((data) => {
          if (data[0].posts.length > 0) {
            // if (setLoading) setLoading(false);
            // if (setRefreshing) setRefreshing(false);

            dispatchIndexPosts({
              data: data[0],
              firstLoad,
              pg: data[0].page,
              likes: data[1].likes,
              storage: true,
              setLoading,
              setRefreshing,
              dispatch,
            });
          } else {
            emitIndexPosts({
              action,
              pgOrUid,
              pg,
              firstLoad,
              setLoading,
              setRefreshing,
              storage: false,
              dispatch,
            });
          }
        })
        .catch(() => {
          emitIndexPosts({
            action,
            pgOrUid,
            pg,
            firstLoad,
            setLoading,
            setRefreshing,
            storage: false,
            dispatch,
          });
        });
    } else {
      emitIndexPosts({
        action,
        pgOrUid,
        pg,
        firstLoad,
        setLoading,
        setRefreshing,
        storage: false,
        lastPost,
        dispatch,
      });
    }
  };
};

const emitIndexPosts = ({
  action,
  pgOrUid,
  pg,
  firstLoad,
  setLoading,
  setRefreshing,
  storage,
  lastPost,
  dispatch,
}) => {
  socket.emit(action, pgOrUid, (data) => {
    // console.log(firstLoad, action, pgOrUid);
    firstLoad && socket.close() && saveCategories(data.categories);
    // console.log("emitIndexPosts", data);

    console.log("firstLoad", firstLoad);
    //get likes for the first load
    if (firstLoad) {
      Storage.load({
        key: "postLikes",
      })
        .then((res) => {
          // console.log(res);
          // console.log("lastPost", lastPost, "data.posts[0]", data.posts[0]);
          // if (JSON.stringify(lastPost) !== JSON.stringify(data.posts[0]))
          dispatchIndexPosts({
            data,
            firstLoad,
            pg,
            likes: res.likes,
            storage,
            setLoading,
            setRefreshing,
            dispatch,
          });
        })
        .catch((err) => {
          Storage.save({
            key: "postLikes",
            data: {
              likes: [],
            },
          });
          dispatchIndexPosts({
            data,
            firstLoad,
            pg,
            likes: [],
            storage,
            setLoading,
            setRefreshing,
            dispatch,
          });
        });
    } else {
      dispatchIndexPosts({
        data,
        firstLoad,
        pg,
        storage,
        setLoading,
        setRefreshing,
        dispatch,
      });
    }
  });
};

const dispatchIndexPosts = ({
  data,
  pg,
  firstLoad,
  likes,
  storage,
  setLoading,
  setRefreshing,
  dispatch,
}) => {
  const payload = {
    posts: data.posts,
    categories: firstLoad ? data.categories : null,
    likes: likes,
    refreshing: false,
    loading: false,
    loadingMore: false,
    page: pg,
    totalPage: 1,
    total: 1,
    storage,
    error: false,
  };

  if (setLoading) setLoading(false);
  if (setRefreshing) setRefreshing(false);

  firstLoad &&
    Storage.save({
      key: "state",
      data: payload,
    });

  // firsLoad && Storage.remove("state");

  return dispatch({
    type: "get_blogposts",
    payload,
  });
};

const saveCategories = (categories, callback) => {
  Storage.save({
    key: "categories",
    data: categories,
  }).then((res) => {
    if (callback) return useCallback(callback);
  });
};

const getCategoryPosts = (dispatch) => {
  return ({
    categoryId,
    categorySlug,
    page,
    setLoading,
    setRefreshing,
    refresh,
    storage,
  }) => {
    // if (page > totalPage) return null;

    if (refresh) {
      socket.close();
      setTimeout(() => {
        socket.open();
      }, 40);
    }

    // await Storage.remove({
    //   key: `categoryPostsPayload${categoryId}`,
    // });
    const pg = parseInt(page) || 0,
      firstLoad = pg === 0;

    // console.log(`before categoryPostsPayload${categoryId}`, pg, storage);

    if (storage) {
      Storage.load({
        key: `categoryPostsPayload${categoryId}`,
      })
        .then((result) => {
          // console.log({
          //   ...{ dispatch, ...{ ...result } },
          // });

          if (setLoading) setLoading(false);
          if (setRefreshing) setRefreshing(false);

          dispatchCategoryPosts({
            ...{ dispatch, ...{ ...result } },
          });
        })
        .catch(() => {
          Storage.save({
            key: `categoryPostsPayload${categoryId}`,
            data: [],
          });
        });
    } else {
      // ((!firstLoad && socket.disconnected) || (firstLoad && refresh)) &&
      socket.open();
      /**
       * For getPostTerm route there are some missing fields for a post item like 'post_url' in response
       */
      socket.emit("getPostTerm", categoryId, "category", pg, function (data) {
        // console.log("getCategoryPosts", data);
        socket.close();

        setLoading(false);
        if (setRefreshing) setRefreshing(false);

        dispatchCategoryPosts({
          data,
          pg,
          error: false,
          categoryId,
          categorySlug,
          storage: false,
          dispatch,
        });
      });
    }
  };
};

const dispatchCategoryPosts = ({
  data,
  pg,
  categoryId,
  categorySlug,
  dispatch,
  storage,
}) => {
  const payload = {
    data,
    page: pg,
    error: false,
    categoryId,
    categorySlug,
  };

  // console.log(pg, storage);

  if (!storage && pg === 0) {
    Storage.save({
      key: `categoryPostsPayload${categoryId}`,
      data: payload,
    });
  }
  dispatch({
    type: "get_blogposts_by_category",
    payload,
  });
};

const getSearchPosts = (dispatch) => {
  return (page, query, refresh) => {
    const pg = page || 0,
      firstLoad = pg === 0;

    const formData = {
      q: query,
      p: pg,
    };
    // socket.off("search");
    socket.open();
    // ((!firstLoad && socket.disconnected) || (firstLoad && refresh)) &&
    socket.emit("search", formData, false, function (data) {
      // socket.close();
      console.log("getSearchPosts", data);
      dispatch({
        type: "get_search_posts",
        payload: {
          searchPosts: data,
          query: query,
          refreshing: false,
          loading: false,
          loadingMore: false,
          searchPage: pg,
          searchStopLoading: data.length < 10,
          //hasNewPosts: hasNewPosts,
          error: false,
        },
      });
    });
  };
};

const getSinglePost = (dispatch) => {
  return (post_url) => {
    // socket.off("search");
    socket.open();
    // socket.close();
    // socket.open();

    socket.emit("getLinkPost", post_url, false, function (data) {
      // socket.close();
      //console.log("getSinglePostFromSlug", data);
      dispatch({
        type: "get_single_post_from_slug",
        payload: {
          post: data.post,
          loadingSharedPost: false,
        },
      });
    });
  };
};

const getPostExtraData = (dispatch) => {
  return async (postId, catId) => {
    // socket.off("search");
    socket.open();
    // ((!firstLoad && socket.disconnected) || (firstLoad && refresh)) &&

    /**
     * for category posts there is no post_url key see above
     **/
    await socket.emit("postTag", postId, catId, 0, function (data) {
      socket.close();
      // console.log("getPostExtraData", data);
      dispatch({
        type: "get_single_post",
        payload: {
          post: data.post,
          related_posts: data.posts,
          related_loading: false,
          postTags: data.tags,
          post_tags: data.tags,
          error: false,
        },
      });
    });
    // socket.close();
    // socket.open();

    // socket.emit("getLinkPost", post_url, false, function (data) {
    //   socket.close();
    //   console.log("getPostExtraData", data);
    //   dispatch({
    //     type: "get_single_post",
    //     payload: {
    //       post: data.post,
    //       related_posts: data.posts,
    //       related_loading: false,
    //       post_categories: data.post.all_cat,
    //       post_tags: data.tags,
    //       error: false,
    //     },
    //   });
    // });
  };
};

const getCategories = (dispatch) => {
  return async () => {
    dispatch({
      type: "get_blogcategories",
      payload: {},
    });
  };
};

export const { Context, Provider } = createDataContext(
  blogReducer,
  {
    setState,
    getBlogPosts,
    getCategoryPosts,
    getLikes,
    getSearchPosts,
    getCategories,
    getPostExtraData,
    getSinglePost,
  },
  {
    page: 0,
    posts: [],
    totalPage: 0,
    total: 0,
    error: false,
    likes: [],
    query: "",
    categories: [],
    searchPosts: [],
    searchPage: 0,
    searchLoading: false,
    searchStopLoading: false,
    searchShowMessage: true,
    searchCache: {},
    sharedPosts: [],
    loadingSharedPost: true,
    //font styles
    baseFontSize: 18,

    /**
     * static zero parent categories with their slug+ID keys
     * @todo
     * if it can try to put these categories from a dynamic source
     */
    categoryPosts: {
      "bilim-teknoloji3": [],
      // "bilim-teknoloji3_page": 0,
      dunya4: [],
      // dunya4_page: 0,
      "kultur-sanat5": [],
      // "kultur-sanat5_page": 0,
      seyahat6: [],
      // seyahat6_page: 0,
      spor7: [],
      // spor7_page: 0,
      tarih1930: [],
      // tarih1930_page: 0,
      yasam8: [],
      // yasam8_page: 0,
      yemek9: [],
      // yemek9_page: 0,
    },
  },
);
