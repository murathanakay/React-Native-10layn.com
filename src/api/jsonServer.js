import axios from "axios";

export default axios.create({
  baseURL: "https://10layn.com/wp-json/wp/v2",
  // timeout: 10,
});
