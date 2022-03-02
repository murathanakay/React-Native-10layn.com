import React, { useReducer, useState } from "react";

export default (reducer, actions, initialState) => {
  const Context = React.createContext();

  const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // const ThemeContext = React.createContext(props.theme);

    //actions == { addBlogPost: (dispatch) => { return () => {} } }

    // console.log(props);

    const boundActions = {};
    for (let key in actions) {
      boundActions[key] = actions[key](dispatch);
    }

    return (
      // <ThemeContext.Provider value={theme}>
      <Context.Provider value={{ state, ...boundActions }}>
        {children}
      </Context.Provider>
      // </ThemeContext.Provider>
    );
  };

  return { Context, Provider };
};
