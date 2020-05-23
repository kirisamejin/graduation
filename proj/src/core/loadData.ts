import * as Cesium from "cesium";
const { ConstantProperty } = Cesium;
// utils
import { cache, getCache } from "./Cache";
import {
  addCorridorEntity,
  addModelEntity,
  datePlusPlus,
  getFirewireStartDate,
  getModelStartDate,
  addTimeIntervalForModels,
  addSecureColorPropertyForModels,
  addStationModel,
} from "./Cesium/Cesium";

// constants
import { FirewireStartDate, MinuteInterval } from "../constants/Time";
import { CurrentUrl } from "../constants/Server";
import { MaterialColor } from "../constants/Colors";
import { Models, StationModel } from "../constants/Models";
// types
import { IPathname } from "../types/User";

function fetchFirewireData(pathname: IPathname) {
  const data = getCache(pathname);
  if (!data) {
    const url = `${CurrentUrl}${pathname}.json`;
    return fetch(url, { method: "GET", mode: "no-cors" }).then((res) => {
      return res.json();
    });
    // const url = `${BackEndUrl}${pathname}`;
    // return fetch(url, { method: "GET", mode: "cors" }).then((res) =>
    //   res.json()
    // );
  } else {
    return new Promise(() => data);
  }
}

function addFirewire(viewer: Cesium.Viewer, pathname: IPathname, data: any) {
  // const positionsProperty = new Cesium.TimeIntervalCollectionProperty();
  // let start = getFirewireStartDate();
  let start = Cesium.JulianDate.fromDate(FirewireStartDate);
  start = Cesium.JulianDate.addMinutes(
    start,
    MinuteInterval,
    new Cesium.JulianDate()
  );
  // let stop = datePlusPlus(start);
  let stop = Cesium.JulianDate.addMinutes(
    start,
    MinuteInterval,
    new Cesium.JulianDate()
  );
  for (const [i, positions] of data.entries()) {
    let index = i + 1;
    // timeCollectionPlusPlus(positionsProperty, start, stop, positions);
    addCorridorEntity(
      viewer.entities,
      positions,
      start,
      stop,
      MaterialColor[pathname],
      `${(index / 6).toFixed(2)}h`
    );
    start = Cesium.JulianDate.addMinutes(
      start,
      MinuteInterval,
      new Cesium.JulianDate()
    );
    stop = Cesium.JulianDate.addMinutes(
      stop,
      MinuteInterval,
      new Cesium.JulianDate()
    );
  }
}

function addFirewires(
  viewer: Cesium.Viewer,
  pathname: IPathname,
  data: any,
  hasLabel: boolean
) {
  // const positionsProperty = new Cesium.TimeIntervalCollectionProperty();
  let start = getFirewireStartDate();
  let stop = datePlusPlus(start);
  for (const [i, positions] of data.entries()) {
    let index = i + 1;
    // timeCollectionPlusPlus(positionsProperty, start, stop, positions);
    addCorridorEntity(
      viewer.entities,
      positions,
      start,
      stop,
      MaterialColor[pathname],
      hasLabel ? `${(index / 6).toFixed(2)}h` : undefined
    );
    start = datePlusPlus(start);
    stop = datePlusPlus(stop);
  }
}

export function loadFirewireData(
  viewer: Cesium.Viewer,
  pathname: IPathname,
  hasLabel: boolean
): Promise<any> {
  return fetchFirewireData(pathname)
    .then((res) => {
      cache(pathname, res);
      addFirewires(viewer, pathname, res, hasLabel);
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
}

export function loadModelsData(viewer: Cesium.Viewer, pathname?: IPathname) {
  const entities = [];
  // console.log(Cesium.Ion.defaultAccessToken);
  for (const key in Object.keys(Models)) {
    const { id, position, uri } = Models[key];
    const entity = addModelEntity(viewer.entities, uri, id, position);
    entities.push(entity);
  }
  return entities;
}
// color change & label text change
function loadModelsChanges(
  data: Array<Array<number>>,
  entities: Cesium.Entity[]
) {
  let start = getModelStartDate();
  let stop = datePlusPlus(start);
  addSecureColorPropertyForModels(entities, start, stop);

  start = datePlusPlus(start);
  stop = datePlusPlus(start);
  for (const positions of data) {
    addTimeIntervalForModels(entities, positions, start, stop);
    start = datePlusPlus(start);
    stop = datePlusPlus(start);
  }
}

export function loadStationModel(viewer: Cesium.Viewer) {
  const model = StationModel;
  addStationModel(viewer.entities, model.uri, model.position, model.id);
}

export function loadStationModels(viewer: Cesium.Viewer) {
  const model = StationModel;
  const positions = model.positions;
  let id = 0;
  const stations = [];
  for (let i = 0; i < model.positions.length; i += 2) {
    const res = addStationModel(
      viewer.entities,
      model.uri,
      [positions[i], positions[i + 1]],
      `${model.id}${id}`
    );
    // console.log(res);
    stations.push(res);
    id++;
  }
  return stations;
}

export function loadData(viewer: Cesium.Viewer, pathname: IPathname) {
  const path2 = "firewire2";
  loadFirewireData(viewer, path2, false);
  return loadFirewireData(viewer, pathname, true).then((firewireData) => {
    const entities = loadModelsData(viewer, pathname);
    loadModelsChanges(firewireData, entities);
    return entities;
  });
}
