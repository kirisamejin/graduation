import * as Cesium from "cesium";
const { ConstantProperty } = Cesium;
// add-on
// @ts-ignore
import CesiumNavigation from "cesium-navigation-es6";

import { Strings } from "../constants/Strings";
import { StartDate, MinuteInterval } from "../constants/Time";
import { IPathname } from "../types/User";
import { DangerColor } from "../constants/Colors";
import { DegreeOfDanger } from "../constants/Models";

export function createViewer(name: string) {
  return new Cesium.Viewer(name, {
    // @ts-ignore
    imageryProvider: new Cesium.MapboxImageryProvider({
      mapId: "mapbox.dark",
      accessToken: Strings.MAPBOX_ACCESS_TOKEN
    })
  });
}

export function datePlusPlus(date: Cesium.JulianDate) {
  return Cesium.JulianDate.addMinutes(
    date,
    MinuteInterval,
    new Cesium.JulianDate()
  );
}

export function timeCollectionPlusPlus(
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
      data
    })
  );
}

export function getFirewireStartDate() {
  return datePlusPlus(Cesium.JulianDate.fromDate(StartDate));
}

export function getModelStartDate() {
  return Cesium.JulianDate.fromDate(StartDate);
}

export function setCesiumNavigation(viewer: Cesium.Viewer) {
  const reg = Cesium.Rectangle.fromDegrees(
    117.16034889,
    31.83126368,
    117.2000885,
    31.85969894
  );
  console.log(reg);
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
    enableCompassOuterRing: true
  });
}

export function setDate(viewer: Cesium.Viewer) {
  const clock = viewer.clock;
  const start = Cesium.JulianDate.fromDate(StartDate);
  const stop = Cesium.JulianDate.addHours(start, 6, new Cesium.JulianDate());
  viewer.timeline.zoomTo(start, stop);
  clock.startTime = start.clone();
  clock.stopTime = stop.clone();
  clock.currentTime = Cesium.JulianDate.addMinutes(
    start,
    10,
    new Cesium.JulianDate()
  );
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
        material: color
      }),
      availability: new Cesium.TimeIntervalCollection([
        new Cesium.TimeInterval({ start, stop })
      ]),
      label: new Cesium.LabelGraphics({
        text: new ConstantProperty(label),
        showBackground: new ConstantProperty(true),
        scale: new ConstantProperty(0.6),
        horizontalOrigin: new ConstantProperty(Cesium.HorizontalOrigin.CENTER),
        verticalOrigin: new ConstantProperty(Cesium.VerticalOrigin.BOTTOM),
        distanceDisplayCondition: new ConstantProperty(
          new Cesium.DistanceDisplayCondition(10.0, 8000.0)
        )
        //disableDepthTestDistance: new ConstantProperty(100.0)
      })
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
        scale: 1.0,
        color: new Cesium.TimeIntervalCollectionProperty()
      }),
      point: new Cesium.PointGraphics({
        color: Cesium.Color.GREEN,
        pixelSize: 10
      }),
      label: new Cesium.LabelGraphics({
        text: new Cesium.TimeIntervalCollectionProperty(),
        showBackground: new ConstantProperty(true),
        scale: new ConstantProperty(0.6),
        horizontalOrigin: new ConstantProperty(Cesium.HorizontalOrigin.CENTER),
        verticalOrigin: new ConstantProperty(Cesium.VerticalOrigin.BOTTOM),
        eyeOffset: new ConstantProperty(new Cesium.Cartesian3(0.0, 100, 0.0)),
        distanceDisplayCondition: new ConstantProperty(
          new Cesium.DistanceDisplayCondition(10.0, 8000.0)
        )
        //disableDepthTestDistance: new ConstantProperty(100.0)
      })
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

function getColorByDistance(distance: number) {
  let color = DangerColor[3];
  if (distance < DegreeOfDanger.DegreeOfDanger1) {
    color = DangerColor[0];
  } else if (distance < DegreeOfDanger.DegreeOfDanger2) {
    color = DangerColor[1];
  } else if (distance < DegreeOfDanger.DegreeOfDanger3) {
    color = DangerColor[2];
  }
  return color;
}

export function addTimeIntervalForModel(
  entity: Cesium.Entity,
  positions: Array<number>,
  start: Cesium.JulianDate,
  stop: Cesium.JulianDate
) {
  const modelPos = entity.position.getValue(start);
  const distance = getMinimumDistance(positions, modelPos);
  const color = getColorByDistance(distance);
  const colorProperty = entity.model.color;
  timeCollectionPlusPlus(
    colorProperty as Cesium.TimeIntervalCollectionProperty,
    start,
    stop,
    color
  );

  const labelTextProperty = entity.label.text;
  const labelText = `${distance.toFixed(2)}m`;
  timeCollectionPlusPlus(
    labelTextProperty as Cesium.TimeIntervalCollectionProperty,
    start,
    stop,
    labelText
  );
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
    timeCollectionPlusPlus(
      colorProperty as Cesium.TimeIntervalCollectionProperty,
      start,
      stop,
      DangerColor[3]
    );
  }
}
