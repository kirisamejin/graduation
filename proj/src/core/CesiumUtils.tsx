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
import {
  createViewer,
  setCesiumNavigation,
  setDate,
  viewer,
  changeColorForModelByBrokenStation,
} from "./Cesium/Cesium";
import { registerClickHanlder } from "./Cesium/Tools";
import {
  loadData,
  loadFirewireData,
  loadModelsData,
  loadStationModel,
  loadStationModels,
} from "./loadData";
import { Legend } from "./Legend";
import { changeSelectorStyle } from "./Cesium/Interactivity";
import { Simulation } from "./Simulation";
//@ts-ignore
// import arr from "../data/firewire.json";

declare type IPathname = "firewire" | "firewire2";

// #TODO: refactor
export const App = (props: {}) => {
  const DEFAULT_MAPURL = `https://api.mapbox.com/styles/v1/${Strings.MAPBOX_USERNAME}/${Strings.MAPBOX_STYLE_ID}/tiles/512/{z}/{x}/{y}?access_token=${Strings.MAPBOX_ACCESS_TOKEN}`;
  Cesium.Ion.defaultAccessToken = Strings.CESIUM_ION_DEFAULT_TOKEN;

  const name = Strings.CONTAINER_NAME;

  const pathname = "firewire";

  //小区模型
  let modelEntities: Cesium.Entity[] = undefined;
  // let _viewer: Cesium.Viewer | undefined = undefined;
  //rendenr
  useEffect(() => {
    if (!viewer) {
      createViewer(name);
      // console.log(viewer);
      setCesiumNavigation(viewer);
      setDate(viewer);
      // show fps infomation
      viewer.scene.debugShowFramesPerSecond = true;

      const pathname = "firewire";
      loadData(viewer, pathname).then((model) => {
        modelEntities = model;
        viewer.zoomTo(viewer.entities);
      });

      // changeSelectorStyle(viewer);
      const stations = loadStationModels(viewer);
      console.log(stations);
      // viewer.zoomTo(viewer.entities);
      // modelEntities = loadModelsData(viewer);

      // registerClickHanlder(viewer);
    }
  });

  const submit = (stationId: number) => {
    if (!modelEntities) {
      console.log("cannot get model entities");
    } else {
      for (const entity of modelEntities) {
        changeColorForModelByBrokenStation(entity, stationId);
      }
    }
  };

  return (
    <>
      <div id={name}></div>
      <Simulation onSubmit={submit} />
      {/* <Simulation /> */}
    </>
  );
};
