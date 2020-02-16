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
  addTimeIntervalForModel,
  timeCollectionPlusPlus,
  addSecureColorPropertyForModels
} from "./Cesium";

// constants
import { StartDate, MinuteInterval } from "../constants/Time";
import { BackEndUrl } from "../constants/Server";
import { MaterialColor } from "../constants/Colors";
import {
  SourceBuildingsId,
  ModelsPositions,
  Models
} from "../constants/Models";
// types
import { IPathname } from "../types/User";

function fetchFirewireData(pathname: IPathname) {
  const data = getCache(pathname);
  if (!data) {
    const url = `${BackEndUrl}${pathname}`;
    return fetch(url, { method: "GET", mode: "cors" }).then(res => res.json());
  } else {
    return new Promise(() => data);
  }
}

function addFirewire(viewer: Cesium.Viewer, pathname: IPathname, data: any) {
  // const positionsProperty = new Cesium.TimeIntervalCollectionProperty();
  // let start = getFirewireStartDate();
  let start = Cesium.JulianDate.fromDate(StartDate);
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
    console.log(start, stop);
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

function addFirewires(viewer: Cesium.Viewer, pathname: IPathname, data: any) {
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
      `${(index / 6).toFixed(2)}h`
    );
    console.log(start, stop);
    start = datePlusPlus(start);
    stop = datePlusPlus(stop);
  }
}

export function loadFirewireData(
  viewer: Cesium.Viewer,
  pathname: IPathname
): Promise<any> {
  return fetchFirewireData(pathname)
    .then(res => {
      cache(pathname, res);
      addFirewires(viewer, pathname, res);
      return res;
    })
    .catch(err => {
      console.log(err);
    });
}

function loadModelsData(
  viewer: Cesium.Viewer,
  pathname?: IPathname
): Promise<Cesium.Entity[]> {
  const promises = [];
  for (const key in Object.keys(Models)) {
    const { id, position } = Models[key];
    const promise = Cesium.IonResource.fromAssetId(id).then((resource: any) => {
      const entity = addModelEntity(viewer.entities, resource, id, position);
      return entity;
    });
    promises.push(promise);
  }
  return Promise.all(promises);
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

export function loadData(viewer: Cesium.Viewer, pathname: IPathname) {
  return Promise.all([
    loadFirewireData(viewer, pathname),
    loadModelsData(viewer, pathname)
  ]).then(([data, entities]) => {
    loadModelsChanges(data, entities);
  });
}
