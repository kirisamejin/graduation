import * as React from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./CesiumUtils.scss";

import { Strings } from "../constants/Strings";
import * as Colors from "../constants/Colors";
// function
import {
  getViewer,
  setCesiumNavigation,
  setDate,
  viewer,
  changeColorForModelByBrokenStation,
} from "./Cesium/Cesium";
import { registerClickHanlder } from "./Cesium/Tools";
import { loadData, loadStationModels } from "./loadData";
import { Legend } from "./Legend";
import { changeSelectorStyle } from "./Cesium/Interactivity";
import { Simulation } from "./Simulation";
//@ts-ignore
// import arr from "../data/firewire.json";

declare type IPathname = "firewire" | "firewire2";

const fetchData = async () => {
  loadStationModels(viewer);
  const pathname = "firewire";
  return loadData(viewer, pathname).then((model) => {
    viewer.zoomTo(viewer.entities);
    return model;
  });
};

const initViewer = async (name: string) => {
  const viewer = getViewer(name);
  console.log("viewer", viewer);
  setCesiumNavigation(viewer);
  setDate(viewer);
  // show fps infomation
  viewer.scene.debugShowFramesPerSecond = true;
  // change style
  changeSelectorStyle(viewer);
  // 异步获取模型
  // return fetchData();
};

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
  const submit = (stationId: number) => {
    if (!modelEntities) {
      console.log("cannot get model entities");
      return;
    }
    for (const entity of modelEntities) {
      changeColorForModelByBrokenStation(entity, stationId);
    }
  };

  async function init() {
    modelEntities = await initViewer(name);
  }

  React.useEffect(() => {
    // init();
  }, []);

  return (
    <>
      <div id={name}></div>
      <Simulation onSubmit={submit} />
      {/* <Simulation /> */}
    </>
  );
};
