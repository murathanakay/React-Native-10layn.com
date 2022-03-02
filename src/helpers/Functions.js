import React from "react";

export function objectsAreSame(x, y) {
  var objectsAreSame = true;
  for (var propertyName in x) {
    if (x[propertyName] !== y[propertyName]) {
      objectsAreSame = false;
      break;
    }
  }
  return objectsAreSame;
}

export function compareFavorites(prevFavs, nextFavs) {
  return JSON.stringify(prevFavs) === JSON.stringify(nextFavs);
}

export function getDeviceTheme(deviceColor) {
  const themeArr = ["dark", "light"];

  const deviceTheme = themeArr.indexOf(deviceColor);

  return deviceTheme !== -1 ? deviceColor : "light";
}

export function isLightTheme(colorScheme) {
  return getDeviceTheme(colorScheme) === "light";
}

export function CreatePostListObjectWithout({ raw, notNeeded }) {
  const res =
    typeof raw !== "undefined"
      ? Object.keys(raw)
          .filter((key) => !notNeeded.includes(key))
          .reduce((obj, key) => {
            obj[key] = raw[key];
            return obj;
          }, {})
      : {};

  return res;
}

export function isLiked(likes, itemId) {
  return typeof likes !== "undefined" && likes.length
    ? typeof likes.find((item) => {
        return item ? item.id === itemId : false;
      }) === "undefined"
      ? false
      : true
    : false;
}

export function getDefaultColor(mode, reverse, alpha) {
  const colors = {
    dark: "#000000",
    light: "#FFFFFF",
  };

  let color = reverse
    ? colors[
        typeof colors[mode] === "undefined"
          ? "dark"
          : mode === "light"
          ? "dark"
          : "light"
      ]
    : typeof colors[mode] === "undefined"
    ? colors["light"]
    : colors[mode];

  return alpha ? hexToRgbA(color, alpha) : color;
}

export function getZeroParentCategories(categories) {
  return Array.from(categories).filter((category) => {
    return category.parent === 0;
  });
}

export function categoryIdsToString(idString, categories) {
  return idString
    .split(",")
    .map((catId) => {
      return categories.find((category) => {
        return category.id == parseInt(catId);
      }).name;
    })
    .join(" - ");
}
export function findPostLastCategoryId(idString, categories) {
  return idString
    .split(",")
    .map((catId) => {
      return categories.find((category) => {
        return category.id == parseInt(catId);
      }).id;
    })
    .pop();
}

export function hexToRgbA(hex, alpha) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return (
      "rgba(" +
      [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
      `,${alpha})`
    );
  }
  throw new Error("Bad Hex");
}

/**
 * @name stripPostHtmlComments
 * @description removes HTML comments from the given array object item
 * @param {array or object} data
 * @param {field key, default is 'content'} field
 * @returns array or object
 */
export function stripPostHtmlComments(data, field = "content") {
  Array.isArray(data)
    ? data.map((item, index) => {
        data[index][field] = item[field].replace(/<\!--.*?-->/g, "");
      })
    : typeof data === "object"
    ? (data[field] = data[field].replace(/<\!--.*?-->/g, ""))
    : data;

  return data;
}

/**
 *
 * @param {string} string
 * @returns
 */
export function countWords(string) {
  return string.replace(/(<([^>]+)>)/gi, "").split(" ").length;
}

export function calculatePostReadingTime(string) {
  const wordCount = countWords(string);

  return Math.ceil(wordCount / 160) + "~" + Math.ceil(wordCount / 100) + "dk";
}
