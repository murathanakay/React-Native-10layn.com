import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  getDefaultColor,
  categoryIdsToString,
  findPostLastCategoryId,
  calculatePostReadingTime,
  getDeviceTheme,
  hexToRgbA,
} from "../helpers/Functions";
import Moment from "moment";
import "moment/src/locale/tr";

export function singlePostProps(categories, blogPost) {
  const date = Moment.utc(blogPost.indate);
  const formattedDate = date.format("D MMMM, YYYY");
  const authorName = blogPost.author_name;
  const categoryNames = categoryIdsToString(blogPost.term_id, categories);

  return { date, formattedDate, authorName, categoryNames };
}
