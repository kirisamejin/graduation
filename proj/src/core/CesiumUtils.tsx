import * as React from "react";
const { useEffect } = React;
// @ts-ignore
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
// @ts-ignore
import CesiumNavigation from "cesium-navigation-es6";

import { Strings } from "../constants/Strings";
import * as Colors from "../constants/Colors";
// function
import { createViewer, setCesiumNavigation, setDate } from "./Cesium";
import { loadData, loadFirewireData } from "./loadData";

declare type IPathname = "firewire" | "firewire2";

// #TODO: refactor
export const App = (props: {}) => {
  const DEFAULT_MAPURL = `https://api.mapbox.com/styles/v1/${Strings.MAPBOX_USERNAME}/${Strings.MAPBOX_STYLE_ID}/tiles/512/{z}/{x}/{y}?access_token=${Strings.MAPBOX_ACCESS_TOKEN}`;
  Cesium.Ion.defaultAccessToken = Strings.CESIUM_ION_DEFAULT_TOKEN;

  const name = Strings.CONTAINER_NAME;

  let viewer: Cesium.Viewer | undefined = undefined;
  //rendenr
  useEffect(() => {
    if (!viewer) {
      viewer = createViewer(name);
      console.log(viewer);
      setCesiumNavigation(viewer);
      setDate(viewer);
      const pathname = "firewire";
      loadData(viewer, pathname).then(() => {
        viewer.zoomTo(viewer.entities);
      });
      // loadFirewireData(viewer, pathname).then(() => {
      //   viewer.zoomTo(viewer.entities);
      // });
    }
  });

  return <div id={name}></div>;
};
