import * as React from "react";
import * as Cesium from "cesium";
import { Strings } from "../constants/Strings";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./CesiumUtils.scss";
import { viewer } from "./Cesium/Cesium";
import { init } from "./Cesium/Fire";

export const App = (props: {}) => {
  const DEFAULT_MAPURL = `https://api.mapbox.com/styles/v1/${Strings.MAPBOX_USERNAME}/${Strings.MAPBOX_STYLE_ID}/tiles/512/{z}/{x}/{y}?access_token=${Strings.MAPBOX_ACCESS_TOKEN}`;
  const pathname = "firewire";
  const name = Strings.CONTAINER_NAME;
  let first = true;
  React.useEffect(() => {
    if (first) {
      init(Strings.CESIUM_ION_DEFAULT_TOKEN, Strings.CONTAINER_NAME);
      first = false;
    }
  });

  return <div id={name}></div>;
};
