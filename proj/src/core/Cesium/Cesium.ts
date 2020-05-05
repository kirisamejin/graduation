import * as Cesium from "cesium";
const { ConstantProperty } = Cesium;
// add-on
// @ts-ignore
import CesiumNavigation from "cesium-navigation-es6";

import { Strings } from "../../constants/Strings";
import {
  FirewireStartDate,
  MinuteInterval,
  PowerStartJulianDate,
  PowerEndJulianDate,
} from "../../constants/Time";
import { IPathname } from "../../types/User";
import {
  DangerColor,
  SilhouetteColor,
  ElectricPowerColor,
} from "../../constants/Colors";
import {
  DegreeOfDanger,
  StationModelPosition,
  DegreeOfElectricPower,
} from "../../constants/Models";
import { IDegree } from "../../types/Cesium";

export let viewer: Cesium.Viewer | undefined = undefined;

export function createViewer(name: string) {
  viewer = new Cesium.Viewer(name, {
    // @ts-ignore
    imageryProvider: new Cesium.MapboxImageryProvider({
      mapId: "mapbox.dark",
      accessToken: Strings.MAPBOX_ACCESS_TOKEN,
      shadows: false,
    }),
  });
  viewer.scene.globe.enableLighting = false;
}

export function datePlusPlus(date: Cesium.JulianDate) {
  return Cesium.JulianDate.addMinutes(
    date,
    MinuteInterval,
    new Cesium.JulianDate()
  );
}

// 增加一个time间隔内的时间
export function setTimeIntervalForModel(
  property: Cesium.TimeIntervalCollectionProperty,
  start: Cesium.JulianDate,
  stop: Cesium.JulianDate,
  data: any
) {
  property.intervals.addInterval(
    new Cesium.TimeInterval({
      start,
      stop,
      isStartIncluded: true,
      isStopIncluded: false,
      data,
    })
  );
}

export function getFirewireStartDate() {
  return datePlusPlus(Cesium.JulianDate.fromDate(FirewireStartDate));
}

export function getModelStartDate() {
  return Cesium.JulianDate.fromDate(FirewireStartDate);
}

export function setCesiumNavigation(viewer: Cesium.Viewer) {
  CesiumNavigation(viewer, {
    defaultResetView: Cesium.Rectangle.fromDegrees(
      117.16034889,
      31.83126368,
      117.2000885,
      31.85969894
    ),
    enableCompass: true,
    enableZoomControls: true,
    enableDistanceLegend: true,
    enableCompassOuterRing: true,
  });
}

export function setDate(viewer: Cesium.Viewer) {
  const clock = viewer.clock;
  const start = Cesium.JulianDate.fromDate(FirewireStartDate);
  // 6小时作为火线模拟时间
  // 接下来10分钟作为跳匝模拟时间
  const stop = Cesium.JulianDate.addHours(start, 7, new Cesium.JulianDate());
  console.log({ "timeline stop data": stop });
  viewer.timeline.zoomTo(start, stop);
  clock.startTime = start.clone();
  clock.stopTime = stop.clone();
  clock.currentTime = start;
  // clock.currentTime = Cesium.JulianDate.addMinutes(
  //   start,
  //   10,
  //   new Cesium.JulianDate()
  // );
  clock.multiplier = 600;
}

export function addCorridorEntity(
  entities: Cesium.EntityCollection,
  positions: Array<number>,
  start: Cesium.JulianDate,
  stop: Cesium.JulianDate,
  color: Cesium.Color,
  label?: string
): Cesium.Entity {
  let index = positions.length / 2;
  if (index % 2 == 1) index--;

  return entities.add(
    new Cesium.Entity({
      // name: 'Yellow line on the surface',
      position: Cesium.Cartesian3.fromDegrees(
        positions[index],
        positions[index + 1],
        20
      ),
      corridor: new Cesium.CorridorGraphics({
        // @ts-ignore
        positions: Cesium.Cartesian3.fromDegreesArray(positions),
        width: new ConstantProperty(3),
        // @ts-ignore
        material: color,
      }),
      availability: new Cesium.TimeIntervalCollection([
        new Cesium.TimeInterval({ start, stop }),
      ]),
      label: new Cesium.LabelGraphics({
        text: new ConstantProperty(label),
        showBackground: new ConstantProperty(true),
        scale: new ConstantProperty(0.6),
        horizontalOrigin: new ConstantProperty(Cesium.HorizontalOrigin.CENTER),
        verticalOrigin: new ConstantProperty(Cesium.VerticalOrigin.BOTTOM),
        distanceDisplayCondition: new ConstantProperty(
          new Cesium.DistanceDisplayCondition(10.0, 8000.0)
        ),
        //disableDepthTestDistance: new ConstantProperty(100.0)
      }),
    })
  );
}

export function addModelEntity(
  entities: Cesium.EntityCollection,
  resource: string,
  id: string,
  position: Array<number>
): Cesium.Entity {
  return entities.add(
    new Cesium.Entity({
      id,
      position: Cesium.Cartesian3.fromDegrees(position[0], position[1], 0),
      //	model: { uri: resource, scale: 4.0 }
      model: new Cesium.ModelGraphics({
        uri: resource,
        scale: 1,
        color: new Cesium.TimeIntervalCollectionProperty(),
        shadows: new ConstantProperty(Cesium.ShadowMode.DISABLED),
        // silhouetteColor: new Cesium.ConstantProperty(SilhouetteColor),
        // silhouetteSize: 1
      }),
      // point: new Cesium.PointGraphics({
      //   color: Cesium.Color.GREEN,
      //   pixelSize: 10
      // }),
      description: new Cesium.TimeIntervalCollectionProperty(),
      // label: new Cesium.LabelGraphics({
      //   text: new Cesium.TimeIntervalCollectionProperty(),
      //   showBackground: new ConstantProperty(true),
      //   scale: new ConstantProperty(0.6),
      //   horizontalOrigin: new ConstantProperty(Cesium.HorizontalOrigin.CENTER),
      //   verticalOrigin: new ConstantProperty(Cesium.VerticalOrigin.BOTTOM),
      //   eyeOffset: new ConstantProperty(new Cesium.Cartesian3(0.0, 100, 0.0)),
      //   distanceDisplayCondition: new ConstantProperty(
      //     new Cesium.DistanceDisplayCondition(10.0, 8000.0)
      //   )
      //   //disableDepthTestDistance: new ConstantProperty(100.0)
      // })
    })
  );
}

function getMinimumDistance(positions: Array<number>, pos: Cesium.Cartesian3) {
  let distance = 2147483647;
  for (let i = 0; i < positions.length; i += 2) {
    distance = Math.min(
      Cesium.Cartesian3.distance(
        Cesium.Cartesian3.fromDegrees(positions[i], positions[i + 1]),
        pos
      ),
      distance
    );
  }
  return distance;
}

function getDistance(pos: Cesium.Cartesian3, stationPos: Array<number>) {
  return Cesium.Cartesian3.distance(
    pos,
    Cesium.Cartesian3.fromDegrees(stationPos[0], stationPos[1])
  );
}

function getColorByDistance(
  distance: number,
  ColorSet: Cesium.Color[],
  DegreeMetrics: IDegree
) {
  let k = 3;
  if (distance < DegreeMetrics.Degree1) {
    k = 0;
  } else if (distance < DegreeMetrics.Degree2) {
    k = 1;
  } else if (distance < DegreeMetrics.Degree3) {
    k = 2;
  }
  return ColorSet[k];
}

export function changeColorForModelByBrokenStation(
  entity: Cesium.Entity,
  stationId: number
) {
  const colorProperty = entity.model.color;
  console.log(
    {
      1: StationModelPosition[stationId * 2],
      2: StationModelPosition[stationId * 2 + 1],
    },
    {
      pos: entity.position.getValue(PowerStartJulianDate),
    }
  );
  const distance = getDistance(entity.position.getValue(PowerStartJulianDate), [
    StationModelPosition[stationId * 2],
    StationModelPosition[stationId * 2 + 1],
  ]);
  // console.log(distance);
  const color = getColorByDistance(
    distance,
    ElectricPowerColor,
    DegreeOfElectricPower
  );
  //console.log(color);
  setTimeIntervalForModel(
    colorProperty as Cesium.TimeIntervalCollectionProperty,
    PowerStartJulianDate,
    PowerEndJulianDate,
    color
  );
  // console.log(colorProperty);

  const descriptionProperty = entity.description;
  const description = new Cesium.ConstantProperty(
    `<div class="description">
        <div class="description-title">距离变电站:</div>   
        <div class="description-content">${distance.toFixed(2)}m</div>
     </div>`
  );
  setTimeIntervalForModel(
    descriptionProperty as Cesium.TimeIntervalCollectionProperty,
    PowerStartJulianDate,
    PowerEndJulianDate,
    description
  );
}

export function addTimeIntervalForModel(
  entity: Cesium.Entity,
  positions: Array<number>,
  start: Cesium.JulianDate,
  stop: Cesium.JulianDate
) {
  const modelPos = entity.position.getValue(start);
  const distance = getMinimumDistance(positions, modelPos);
  const color = getColorByDistance(distance, DangerColor, DegreeOfDanger);
  const colorProperty = entity.model.color;
  setTimeIntervalForModel(
    colorProperty as Cesium.TimeIntervalCollectionProperty,
    start,
    stop,
    color
  );

  const descriptionProperty = entity.description;
  const description = new Cesium.ConstantProperty(
    `<div class="description">
        <div class="description-title">当前最小距离:</div>   
        <div class="description-content">${distance.toFixed(2)}m</div>
     </div>`
  );
  setTimeIntervalForModel(
    descriptionProperty as Cesium.TimeIntervalCollectionProperty,
    start,
    stop,
    description
  );

  // const labelTextProperty = entity.label.text;
  // const labelText = `${distance.toFixed(2)}m`;
  // timeCollectionPlusPlus(
  //   labelTextProperty as Cesium.TimeIntervalCollectionProperty,
  //   start,
  //   stop,
  //   labelText
  // );
}

export function addTimeIntervalForModels(
  entities: Cesium.Entity[],
  positions: Array<number>,
  start: Cesium.JulianDate,
  stop: Cesium.JulianDate
) {
  for (const entity of entities) {
    addTimeIntervalForModel(entity, positions, start, stop);
  }
}

export function addSecureColorPropertyForModels(
  entities: Cesium.Entity[],
  start: Cesium.JulianDate,
  stop: Cesium.JulianDate
) {
  for (const entity of entities) {
    const colorProperty = entity.model.color;
    setTimeIntervalForModel(
      colorProperty as Cesium.TimeIntervalCollectionProperty,
      start,
      stop,
      DangerColor[3]
    );
  }
}
//color: new Color(1, 0.3, 0.2, 1)
export function addStationModel(
  entities: Cesium.EntityCollection,
  uri: string,
  position: number[],
  id: string
) {
  const start = PowerStartJulianDate.clone();
  const stop = PowerEndJulianDate.clone();
  console.log("time", {
    start,
    stop,
  });
  return entities.add(
    new Cesium.Entity({
      id,
      position: Cesium.Cartesian3.fromDegrees(position[0], position[1], 0),
      //	model: { uri: resource, scale: 4.0 }
      model: new Cesium.ModelGraphics({
        uri,
        scale: 0.003,
        color: new Cesium.TimeIntervalCollectionProperty(),
        // silhouetteColor: new Cesium.ConstantProperty(SilhouetteColor),
        // silhouetteSize: 1
      }),
      availability: new Cesium.TimeIntervalCollection([
        new Cesium.TimeInterval({ start, stop }),
      ]),
    })
  );
}
