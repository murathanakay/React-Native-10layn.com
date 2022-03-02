import React from "react";
import io from "socket.io-client";

export const socket = io("https://api.10layn.com:8080", {
  secure: true,
  transports: ["websocket"],
  forceNew: false,
});
